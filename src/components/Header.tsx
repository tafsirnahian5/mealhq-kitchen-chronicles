
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, User, LogOut, Settings, Home, ClipboardList, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;

  const getInitials = () => {
    if (!user) return 'G';
    
    const name = user.user_metadata?.name || user.email || '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-mealhq-red rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-xl font-semibold text-mealhq-dark">MealHQ</span>
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 py-4">
                  {isLoggedIn ? (
                    <>
                      <Link 
                        to="/home" 
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Home size={18} />
                        <span>Home</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <Link 
                        to="/meal-table" 
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ClipboardList size={18} />
                        <span>Meal Table</span>
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShieldCheck size={18} />
                          <span>Admin</span>
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-left w-full"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Log In</span>
                      </Link>
                      <Link 
                        to="/signup" 
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link to="/home" className="text-gray-700 hover:text-mealhq-red transition-colors">
                  Home
                </Link>
                <Link to="/meal-table" className="text-gray-700 hover:text-mealhq-red transition-colors">
                  Meal Table
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-mealhq-red transition-colors">
                    Admin
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0" size="sm">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-mealhq-red text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer flex items-center gap-2">
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500 flex items-center gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-mealhq-red hover:bg-mealhq-red-light">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
