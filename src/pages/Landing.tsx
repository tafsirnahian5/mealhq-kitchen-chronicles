
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-mealhq-dark mb-6">
              Simplify Your <span className="text-mealhq-red">Meal Planning</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              The smart way to organize meals for your dorm, office, or community living space
            </p>
            
            {user ? (
              <Link to="/home">
                <Button className="bg-mealhq-red hover:bg-mealhq-red-light text-white px-10 py-6 text-lg rounded-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button className="bg-mealhq-red hover:bg-mealhq-red-light text-white px-10 py-6 text-lg rounded-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-mealhq-red text-mealhq-red hover:bg-mealhq-red/10 px-10 py-6 text-lg rounded-lg">
                    Log In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How MealHQ Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-mealhq-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-mealhq-red">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Update Your Meal Preferences</h3>
                <p className="text-gray-600">
                  Tell us which meals you'll be having each day and any extras you might want
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-mealhq-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-mealhq-red">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">View Daily Meal Count</h3>
                <p className="text-gray-600">
                  Administrators can easily see how many meals to prepare each day
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-mealhq-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-mealhq-red">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Expenses & Inventory</h3>
                <p className="text-gray-600">
                  Manage your inventory, generate shopping lists, and keep track of all expenses
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 px-4 bg-mealhq-dark text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to streamline your meal management?</h2>
            <p className="text-xl mb-10">
              Join MealHQ today and experience the easiest way to coordinate meals for your group
            </p>
            
            {user ? (
              <Link to="/home">
                <Button className="bg-mealhq-red hover:bg-mealhq-red-light text-white px-8 py-3 text-lg rounded-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button className="bg-mealhq-red hover:bg-mealhq-red-light text-white px-8 py-3 text-lg rounded-lg">
                  Sign Up Now
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
