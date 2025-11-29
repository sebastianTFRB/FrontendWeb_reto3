import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Home, Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react'
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
  })

  useEffect(() => {
    if (token) {
      navigate('/app', { replace: true })
    }
  }, [token, navigate])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setFeedback(undefined)
    try {
      await login(formData.email, formData.password)
      navigate('/app', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesion'
      setFeedback(message)
    }
  }

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    setFeedback(undefined)
    if (formData.password !== formData.confirmPassword) {
      setFeedback('Las contrasenas no coinciden')
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      })
      setAuthMode('login')
      setFeedback('Cuenta creada. Inicia sesion.')
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo registrar'
      setFeedback(message)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center p-4"
      style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/12 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/12 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-3 shadow-xl border border-red-500">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">FULL HOUSE</h1>
            </div>
          </div>
          <p className="text-sm text-gray-300 font-semibold tracking-widest uppercase">
            Real Estate Lead Qualification
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-black/60 rounded-xl p-8 shadow-2xl border border-red-600/30 backdrop-blur-lg">
          <div className="flex gap-3 mb-8 bg-black/40 rounded-lg p-1.5 border border-red-600/20">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
                authMode === 'login' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
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

          {authMode === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold tracking-widest text-white uppercase mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white placeholder-gray-500 font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-white uppercase mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white placeholder-gray-500 font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-black/40 border-2 border-red-600/50 rounded accent-red-600"
                  />
                  <span className="text-xs font-semibold text-gray-300">Remember me</span>
                </label>
                <button className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 tracking-wide uppercase"
                disabled={loading}
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-red-600/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-gradient-to-br from-slate-900/80 to-black/60 text-gray-400 font-semibold">
                    OR
                  </span>
                </div>
              </div>

              <p className="text-center text-xs font-semibold text-gray-300">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  CREATE ONE
                </button>
              </p>
            </form>
          )}

          {authMode === 'register' && (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-bold tracking-widest text-white uppercase mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white placeholder-gray-500 font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-white uppercase mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white placeholder-gray-500 font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-white uppercase mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white placeholder-gray-500 font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-white uppercase mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-red-600/30 rounded-lg text-white placeholder-gray-500 font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-black/40 border-2 border-red-600/50 rounded accent-red-600 mt-1"
                  required
                />
                <span className="text-xs font-semibold text-gray-300">
                  I agree to the{' '}
                  <button className="text-red-500 hover:text-red-400" type="button">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-red-500 hover:text-red-400" type="button">
                    Privacy Policy
                  </button>
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 tracking-wide uppercase"
                disabled={loading}
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs font-semibold text-gray-300">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  SIGN IN
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            © 2024 Full House. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
