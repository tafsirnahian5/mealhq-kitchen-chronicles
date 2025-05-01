
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Grid2X2, User, Menu } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, isAdmin = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="w-full py-4 px-4 md:px-6 bg-background border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-mealhq-red rounded-full flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="logo-text text-xl md:text-2xl">MealHQ</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full mr-2"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
              >
                <Menu size={20} />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/meal-table')}
                  >
                    <Grid2X2 size={18} />
                    <span>Meal Table</span>
                  </Button>
                )}
                
                {isAdmin ? (
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/admin')}
                  >
                    <User size={18} />
                    <span>Admin</span>
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/profile')}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Button>
                )}
              </>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobile && showMobileMenu && isLoggedIn && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-md animate-in slide-in-from-top-5 duration-200">
          <div className="p-4 flex flex-col space-y-2">
            {isAdmin && (
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2 w-full"
                onClick={() => {
                  navigate('/meal-table');
                  setShowMobileMenu(false);
                }}
              >
                <Grid2X2 size={18} />
                <span>Meal Table</span>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              className="flex items-center justify-start gap-2 w-full"
              onClick={() => {
                navigate(isAdmin ? '/admin' : '/profile');
                setShowMobileMenu(false);
              }}
            >
              <User size={18} />
              <span>{isAdmin ? 'Admin' : 'Profile'}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
