import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Home, Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertTriangle, Phone } from 'lucide-react'
import { useAuth } from '../../../shared/hooks/useAuth'

type AuthMode = 'login' | 'register'

type LoginPageProps = {
  initialMode?: AuthMode
}

export const LoginPage = ({ initialMode = 'login' }: LoginPageProps) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token, login, register, error: authError, loading } = useAuth()

  const modeFromQuery = searchParams.get('mode') as AuthMode | null
  const [authMode, setAuthMode] = useState<AuthMode>(modeFromQuery ?? initialMode)

  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<string>()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  })

  // Redirige si ya tiene token
  useEffect(() => {
    if (token) navigate('/app', { replace: true })
  }, [token, navigate])

  // Limpiar al cambiar modo
  useEffect(() => {
    setFeedback(undefined)
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
    }))
    setShowPassword(false)
  }, [authMode])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    // LOGIN: no permitir espacios
    if (authMode === 'login') {
      if (name === 'email' || name === 'password') {
        setFormData((prev) => ({ ...prev, [name]: value.replace(/\s+/g, '') }))
        return
      }
    }

    // REGISTRO — nombre con letras + espacios normales
    if (name === 'fullName') {
      const cleaned = value
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '') // solo letras y espacios
        .replace(/\s{2,}/g, ' ')                // no doble espacio
        .trimStart()                             // sin espacio al inicio
        .slice(0, 40)                            // max 40 chars

      setFormData((prev) => ({ ...prev, fullName: cleaned }))
      return
    }

    // REGISTRO — phone: opcional, solo números si escribe algo
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 15)
      setFormData((prev) => ({ ...prev, phone: digits }))
      return
    }

    // Email en registro
    if (name === 'email') {
      setFormData((prev) => ({ ...prev, email: value.trim() }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // LOGIN
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setFeedback(undefined)

    if (!formData.email || !formData.password) {
      setFeedback('Ingresa tu correo y contraseña.')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFeedback('Ingresa un correo electrónico válido.')
      return
    }

    if (formData.password.length < 8 || formData.password.length > 64) {
      setFeedback('La contraseña debe tener entre 8 y 64 caracteres.')
      return
    }

    try {
      await login(formData.email, formData.password)
      navigate('/app', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión'
      setFeedback(message)
    }
  }

  // REGISTRO
  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    setFeedback(undefined)

    if (!formData.fullName || formData.fullName.length < 3) {
      setFeedback('Ingresa un nombre válido (solo letras).')
      return
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setFeedback('Ingresa un correo electrónico válido.')
      return
    }

    if (formData.password.length < 8 || formData.password.length > 64) {
      setFeedback('La contraseña debe tener entre 8 y 64 caracteres.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFeedback('Las contraseñas no coinciden.')
      return
    }

    // PHONE ES OPCIONAL
    if (formData.phone && (formData.phone.length < 7 || formData.phone.length > 15)) {
      setFeedback('El teléfono debe tener entre 7 y 15 dígitos (si decides ingresarlo).')
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone || undefined, // opcional
      })
      setAuthMode('login')
      setFeedback('Cuenta creada. Inicia sesión.')
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo registrar'
      setFeedback(message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/12 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/12 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-3 shadow-xl border border-red-500">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">FULL HOUSE</h1>
          </div>
          <p className="text-sm text-gray-300 tracking-widest uppercase">Real Estate Lead Qualification</p>
        </div>

        {/* CARD */}
        <div className="bg-gradient-to-br from-slate-900/80 to-black/60 rounded-xl p-8 shadow-2xl border border-red-600/30 backdrop-blur-lg">

          {/* SWITCH LOGIN / REGISTER */}
          <div className="flex gap-3 mb-8 bg-black/40 rounded-lg p-1.5 border border-red-600/20">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition ${
                authMode === 'login' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition ${
                authMode === 'register' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>

          {(feedback || authError) && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              <span>{feedback || authError}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin} autoComplete="off">

              <label className="block text-xs font-bold text-white uppercase mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                  required
                />
              </div>

              <label className="block text-xs font-bold text-white uppercase mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="off"
                  minLength={8}
                  maxLength={64}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 mt-4 rounded-lg shadow-xl hover:shadow-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form className="space-y-6" onSubmit={handleRegister} autoComplete="off">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-3">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jonh Doe"
                    maxLength={40}
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              {/* Phone (opcional) */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-3">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="3001234567"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-3">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-3">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={64}
                    className="w-full pl-12 pr-12 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-3">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={64}
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-lg shadow-xl hover:shadow-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                Create Account <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
