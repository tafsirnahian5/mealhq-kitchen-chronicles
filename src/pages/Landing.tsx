
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header with logo and login/signup buttons */}
      <header className="w-full py-4 px-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-mealhq-red rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="logo-text">MealHQ</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="default" 
              className="bg-mealhq-red hover:bg-mealhq-red-light" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content section with hero image */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-mealhq-red">
                Simplify Your Meal Management
              </h1>
              <p className="text-lg text-muted-foreground">
                Track meals, manage inventory, and optimize your meal planning
                with MealHQ's powerful yet simple tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-mealhq-red hover:bg-mealhq-red-light"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/8cab467c-813a-4f6e-addd-212c5a547787.png" 
                alt="MealHQ Preview" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer section */}
      <footer className="bg-background border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-mealhq-red rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-lg font-medium">MealHQ</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              Simplifying meal management for groups and organizations.
            </p>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; 2025 MealHQ. All rights reserved.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
