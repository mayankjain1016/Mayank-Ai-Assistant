import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Conversations', path: '/conversations' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <h1 className="font-serif text-2xl font-bold text-stone-100 tracking-tight">
          Mayank AI
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "block px-4 py-2 transition-colors",
                isActive
                  ? "text-stone-100 font-medium"
                  : "text-stone-500 hover:text-stone-300"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto">
        <button
          onClick={logout}
          className="text-stone-500 hover:text-stone-300 transition-colors text-sm uppercase tracking-widest"
        >
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-stone-900 text-stone-100 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-stone-900 border-r border-stone-800 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-stone-900 border-b border-stone-800 z-30 flex items-center justify-between px-6">
        <span className="font-serif text-xl font-bold text-stone-100">
          Mayank AI
        </span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-stone-400 hover:text-stone-100 uppercase tracking-widest text-xs font-medium"
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-stone-900 pt-16 flex flex-col" onClick={() => setIsMobileMenuOpen(false)}>
          <SidebarContent />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pt-16 lg:pt-0 scroll-smooth">
        <div className="p-6 lg:p-12 max-w-6xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
