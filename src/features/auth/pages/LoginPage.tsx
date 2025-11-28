import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Home,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

type AuthMode = 'login' | 'register'

type LoginPageProps = {
  initialMode?: AuthMode
}

export const LoginPage = ({ initialMode = 'login' }: LoginPageProps) => {
  const [searchParams] = useSearchParams()
  const modeFromQuery = searchParams.get('mode') as AuthMode | null
  const [authMode, setAuthMode] = useState<AuthMode>(modeFromQuery ?? initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    phone: '',
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (event: FormEvent) => {
    event.preventDefault()
    alert(`Login demo: ${formData.email}`)
  }

  const handleRegister = (event: FormEvent) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    alert(`Cuenta creada (demo) para ${formData.fullName}`)
  }

  const gradientButton =
    'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-light py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 tracking-wide'

  const inputBase =
    'w-full bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 font-light focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600 transition-all'

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 p-3 shadow-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-wide text-white">FULL HOUSE</h1>
            </div>
          </div>
          <p className="text-sm font-light tracking-wide text-slate-400">
            Real Estate Lead Qualification
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8 flex gap-2 rounded-lg bg-slate-900/50 p-1">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 rounded-md py-3 px-4 text-sm font-light tracking-wide transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 rounded-md py-3 px-4 text-sm font-light tracking-wide transition-all ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          {authMode === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`${inputBase} pl-12 pr-4 py-3`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`${inputBase} pl-12 pr-12 py-3`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transform text-slate-500 transition-colors hover:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-slate-700 bg-slate-900/50 accent-pink-600"
                  />
                  <span className="text-xs font-light text-slate-400">Remember me</span>
                </label>
                <button className="text-xs font-light text-pink-500 transition-colors hover:text-pink-400">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className={gradientButton}>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-xs font-light text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-normal text-pink-500 transition-colors hover:text-pink-400"
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {authMode === 'register' && (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`${inputBase} pl-12 pr-4 py-3`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Real Estate Company"
                    className={`${inputBase} pl-12 pr-4 py-3`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`${inputBase} pl-12 pr-4 py-3`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 300 000 0000"
                  className={`${inputBase} px-4 py-3`}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`${inputBase} pl-12 pr-12 py-3`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transform text-slate-500 transition-colors hover:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-light uppercase tracking-widest text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`${inputBase} pl-12 pr-4 py-3`}
                    required
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border border-slate-700 bg-slate-900/50 accent-pink-600"
                  required
                />
                <span className="text-xs font-light text-slate-400">
                  I agree to the{' '}
                  <button className="text-pink-500 hover:text-pink-400">Terms of Service</button> and{' '}
                  <button className="text-pink-500 hover:text-pink-400">Privacy Policy</button>
                </span>
              </label>

              <button type="submit" className={gradientButton}>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-xs font-light text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-normal text-pink-500 transition-colors hover:text-pink-400"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-light text-slate-500">© 2024 Full House. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
