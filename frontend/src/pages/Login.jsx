import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { Loader2, Mail, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      hasError = true;
    }
    if (!password) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await axiosClient.post('/api/v1/auth/login', {
        email,
        password,
      });

      const { accessToken, user } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      login(accessToken);
      
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Incorrect email or password.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-stone-900 flex font-sans text-stone-100">
      
      {/* Left Side: Branding */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-center items-center overflow-hidden bg-stone-900 border-r border-stone-800">
        <div className="relative z-10 p-12 max-w-lg text-center">
          <div className="font-serif text-5xl font-bold tracking-tight mb-6 text-stone-100">
            Mayank AI
          </div>
          <p className="text-stone-400 text-lg font-serif italic">
            Your trusted ledger for automated Instagram interactions.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 bg-stone-900">
        
        {/* Mobile branding */}
        <div className="lg:hidden text-center mb-12">
          <div className="font-serif text-4xl font-bold tracking-tight text-stone-100">
            Mayank AI
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-serif text-stone-100 mb-2">Sign in</h2>
            <p className="text-stone-400">Access your assistant's control panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {error && (
              <div className="text-clay-500 text-sm py-2 border-b border-clay-500/30">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-400 uppercase tracking-widest text-xs">
                Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                  disabled={loading}
                  className={cn(
                    "w-full bg-transparent border-b py-2 text-stone-100 placeholder-stone-600 focus:outline-none transition-all",
                    emailError 
                      ? "border-clay-500" 
                      : "border-stone-700 focus:border-stone-400"
                  )}
                  placeholder="admin@example.com"
                />
              </div>
              {emailError && <p className="text-clay-500 text-xs mt-1">Please enter a valid email.</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-400 uppercase tracking-widest text-xs">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  disabled={loading}
                  className={cn(
                    "w-full bg-transparent border-b py-2 text-stone-100 placeholder-stone-600 focus:outline-none transition-all",
                    passwordError 
                      ? "border-clay-500" 
                      : "border-stone-700 focus:border-stone-400"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {passwordError && <p className="text-clay-500 text-xs mt-1">Password is required.</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-100 text-stone-900 hover:bg-stone-200 font-medium py-3 px-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-sm uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin shrink-0" />
                  <span>Authenticating</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
