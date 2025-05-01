
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Grid2X2, User } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, isAdmin = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="w-full py-4 px-6 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-mealhq-red rounded-full flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="logo-text">MealHQ</span>
        </Link>

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
      </div>
    </header>
  );
};

export default Header;
