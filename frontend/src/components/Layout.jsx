import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, LogOut, Menu, X, Bot } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Conversations', path: '/conversations', icon: MessageCircle },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
          <Bot size={20} />
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent truncate">
          Mayank AI
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 font-medium"
                  : "text-slate-400 hover:text-slate-50 hover:bg-slate-800/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
              )}
              <Icon size={20} className={cn("shrink-0", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300 transition-colors")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
        >
          <LogOut size={20} className="shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800/50 flex-col relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <Bot size={20} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Mayank AI
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-slate-400 hover:text-slate-50 transition-colors rounded-lg hover:bg-slate-800/50"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <aside 
            className="w-64 h-full bg-slate-950 border-r border-slate-800/50 flex flex-col pt-16 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pt-16 lg:pt-0 relative z-10 scroll-smooth">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
