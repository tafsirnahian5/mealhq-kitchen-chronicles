
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState<'admin' | 'user'>('user');
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  // Check if we have a new admin coming from a transfer
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newAdmin = searchParams.get('newAdmin');
    
    if (newAdmin) {
      setFormData(prev => ({ ...prev, name: newAdmin }));
      setLoginMode('admin');
      toast.info(`Welcome ${newAdmin}! You have been granted admin privileges. Please log in.`);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we'll just show a success message and redirect
    toast.success(`Successfully logged in as ${loginMode}!`);
    
    // Simulate login and redirect to appropriate page
    setTimeout(() => {
      if (loginMode === 'admin') {
        navigate('/home', { state: { isAdmin: true, isLoggedIn: true } });
      } else {
        navigate('/home', { state: { isAdmin: false, isLoggedIn: true } });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <Card className="border-mealhq-beige">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Login to access your MealHQ account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={loginMode} value={loginMode} className="w-full" onValueChange={(value) => setLoginMode(value as 'admin' | 'user')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Enter your name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-mealhq-red hover:bg-mealhq-red-light">
                    Login
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate('/signup')}>
              Don't have an account? Sign up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
