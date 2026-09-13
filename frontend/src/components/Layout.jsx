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
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-black shrink-0">
          <Bot size={20} />
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-gray-500 to-black bg-clip-text text-transparent truncate">
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
                  ? "bg-gray-100 text-black font-medium"
                  : "text-gray-500 hover:text-black hover:bg-gray-100"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black rounded-r-full" />
              )}
              <Icon size={20} className={cn("shrink-0", isActive ? "text-black" : "text-black0 group-hover:text-gray-700 transition-colors")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
        >
          <LogOut size={20} className="shrink-0 text-black0 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-black overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-50 border-r border-gray-200 flex-col relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-black shrink-0">
            <Bot size={20} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-gray-500 to-black bg-clip-text text-transparent">
            Mayank AI
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-gray-50/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <aside 
            className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col pt-16 shadow-2xl" 
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

