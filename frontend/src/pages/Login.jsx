import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { Bot, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Left Side: Branding / Hero */}
      <div className="hidden lg:flex flex-1 relative bg-white border-r border-gray-200 flex-col justify-between overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gray-200 blur-[120px] rounded-full" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Bot size={24} />
            </div>
            <span className="text-xl font-bold text-black tracking-tight">Mayank AI</span>
          </div>
        </div>

        <div className="relative z-10 p-12 max-w-2xl">
          <h1 className="text-4xl xl:text-5xl font-bold text-black tracking-tight leading-tight mb-6">
            Intelligent conversations, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">automated perfectly.</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Manage your AI-powered Instagram responses, track daily engagement trends, and oversee all conversations from one unified command center.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile branding header */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Bot size={24} />
          </div>
          <span className="text-2xl font-bold text-black tracking-tight">Mayank AI</span>
        </div>

        <div className="w-full max-w-[420px] bg-white lg:bg-transparent border border-gray-200 lg:border-none p-8 lg:p-0 rounded-2xl shadow-xl lg:shadow-none">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm sm:text-base">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black0 group-focus-within:text-black transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                  disabled={loading}
                  className={cn(
                    "w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 text-black placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all",
                    emailError 
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 focus:ring-black/20 focus:border-black"
                  )}
                  placeholder="admin@example.com"
                />
              </div>
              {emailError && <p className="text-red-400 text-xs pl-1">Please enter a valid email.</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black0 group-focus-within:text-black transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  disabled={loading}
                  className={cn(
                    "w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 text-black placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all",
                    passwordError 
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                      : "border-gray-200 focus:ring-black/20 focus:border-black"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {passwordError && <p className="text-red-400 text-xs pl-1">Password is required.</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 mt-6 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin shrink-0" />
                  <span>Signing in...</span>
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

