import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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

    if (!email || !password) return;

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
      setError('Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col justify-center items-center p-6 font-sans">
      
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-apple-text mb-2">Mayank AI</h1>
          <p className="text-[15px] text-apple-meta">Sign in to your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4 bg-apple-surface/50 p-6 rounded-3xl">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-apple-bg border border-apple-border rounded-xl px-4 py-3 text-[15px] text-apple-text placeholder-apple-meta focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all"
                placeholder="Apple ID / Email"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-apple-bg border border-apple-border rounded-xl px-4 py-3 text-[15px] text-apple-text placeholder-apple-meta focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-apple-text text-white hover:bg-black font-semibold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 text-[15px]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
