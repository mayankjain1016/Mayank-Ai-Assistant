import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Conversations', path: '/conversations' },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text font-sans selection:bg-apple-blue selection:text-white pb-20">
      
      {/* Top Navigation - Frosted Glass */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/70 backdrop-blur-xl border-b border-apple-border" : "bg-transparent"
        )}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="font-bold text-lg tracking-tight hover:opacity-70 transition-opacity">
              Mayank AI
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-[13px] font-medium transition-colors",
                      isActive ? "text-apple-text" : "text-apple-meta hover:text-apple-text"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="hidden md:block text-[13px] font-medium text-apple-meta hover:text-apple-text transition-colors"
            >
              Sign Out
            </button>
            <button 
              className="md:hidden text-apple-text font-medium text-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-2xl font-semibold tracking-tight">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={pathname.startsWith(item.path) ? "text-apple-text" : "text-apple-meta"}
              >
                {item.name}
              </Link>
            ))}
            <button onClick={logout} className="text-left text-apple-meta mt-4">
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-24 lg:pt-32 px-6 max-w-5xl mx-auto w-full min-h-[calc(100vh-8rem)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
