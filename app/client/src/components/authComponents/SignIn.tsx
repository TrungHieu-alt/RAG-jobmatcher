import { useState } from 'react';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';

interface SignInProps {
  onNavigate: (screen: 'signin' | 'signup' | 'forgot') => void;
  onOpenPolicy: () => void;
}

export function SignIn({ onNavigate }: SignInProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setError(null);

    // VALIDATION
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      
      // Decode JWT to get user_id
      const decoded = JSON.parse(atob(res.access_token.split('.')[1]));
      localStorage.setItem("user_id", String(decoded.user_id || decoded.sub));
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || err?.details?.detail || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-linear-to-br from-[#A78BFA] to-[#C7D2FE]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div 
          className="bg-white/25 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl shadow-purple-900/10"
          style={{
            boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Briefcase className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-center text-gray-900 mb-1">
            Sign in to JobMatching Hub
          </h1>

          <p className="text-center text-gray-700 mb-5">
            Use your email and password to continue. Secure & privacy-friendly.
          </p>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-3.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/60 transition-all disabled:opacity-50"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-3.5 pr-12 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/60 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="mb-3 p-3 bg-red-100/50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-linear-to-r from-purple-600 to-purple-500 text-white py-3.5 rounded-2xl mb-3 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex flex-col items-center gap-2.5 mb-3">
            <button
              onClick={() => onNavigate('forgot')}
              disabled={loading}
              className="text-purple-900 hover:text-purple-950 transition-colors underline decoration-1 underline-offset-4 disabled:opacity-50"
            >
              Forgot password?
            </button>
            <div className="text-gray-700">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                disabled={loading}
                className="text-purple-900 hover:text-purple-950 transition-colors underline decoration-1 underline-offset-4 disabled:opacity-50"
              >
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}