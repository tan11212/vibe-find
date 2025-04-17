
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Home, Menu, LogOut, LogIn, Heart, MessageSquare, Settings, PlusCircle, Shield, Search } from 'lucide-react';
import PanicButton from './PanicButton';

const NavItem = ({ href, icon, label, onClick, isActive }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}) => (
  <Link 
    to={href} 
    className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${
      isActive 
        ? 'bg-purple-100 text-purple-700' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-purple-800">SafePG</Link>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/favorites">
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Heart size={20} />
                  </Button>
                </Link>
                
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <Menu size={20} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[250px] sm:w-[300px]">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 p-4 border-b">
                        <Avatar>
                          <AvatarImage src={profile?.avatar_url} />
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      <nav className="flex-1 py-4 px-2 space-y-1">
                        <NavItem 
                          href="/" 
                          icon={<Home size={18} />} 
                          label="Home" 
                          isActive={location.pathname === '/'}
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <NavItem 
                          href="/roommate-finder" 
                          icon={<Search size={18} />} 
                          label="Find Roommates" 
                          isActive={location.pathname === '/roommate-finder'}
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <NavItem 
                          href="/favorites" 
                          icon={<Heart size={18} />} 
                          label="Favorites" 
                          isActive={location.pathname === '/favorites'}
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <NavItem 
                          href="/pg-listing-form" 
                          icon={<PlusCircle size={18} />} 
                          label="List PG" 
                          isActive={location.pathname === '/pg-listing-form'}
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <NavItem 
                          href="/settings" 
                          icon={<Settings size={18} />} 
                          label="Settings" 
                          isActive={location.pathname === '/settings'}
                          onClick={() => setIsMenuOpen(false)}
                        />
                        
                        <hr className="my-2 border-gray-200" />
                        
                        <div 
                          className="flex items-center gap-2 py-2 px-3 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </div>
                      </nav>
                      
                      <div className="mt-auto px-2 py-4 border-t">
                        <PanicButton />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                variant="default"
                className="bg-appPurple hover:bg-appPurple-dark"
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold">SafePG</h3>
              <p className="text-sm text-gray-300">Find your safe space</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white text-sm">Home</Link>
              <Link to="/roommate-finder" className="text-gray-300 hover:text-white text-sm">Find Roommates</Link>
              <Link to="/settings" className="text-gray-300 hover:text-white text-sm">Settings</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SafePG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
