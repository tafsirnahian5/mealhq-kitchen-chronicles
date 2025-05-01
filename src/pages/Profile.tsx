
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Profile = () => {
  const [mealCount, setMealCount] = useState('1');
  const [mealSubmitted, setMealSubmitted] = useState(false);
  const [defaultMealEnabled, setDefaultMealEnabled] = useState(false);
  const [defaultMealCount, setDefaultMealCount] = useState('1');

  // Mock user data
  const userData = {
    name: "John Doe",
    totalMeals: 28,
    totalDinner: 22,
    joinedDate: "April 15, 2025"
  };

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success(`${mealCount} meal(s) submitted for today!`);
    setMealSubmitted(true);
  };

  const handleDefaultMealSave = () => {
    toast.success(`Default meal count set to ${defaultMealCount}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your meal preferences and view statistics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-mealhq-red/20 flex items-center justify-center text-mealhq-red text-2xl font-bold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{userData.joinedDate}</p>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium mb-2">My Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Total Meals</p>
                      <p className="text-xl font-bold">{userData.totalMeals}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Total Dinner</p>
                      <p className="text-xl font-bold">{userData.totalDinner}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Today's Meal</CardTitle>
              <CardDescription>
                You can submit your meal count once per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!mealSubmitted ? (
                <form onSubmit={handleMealSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mealCount">How many meals do you want today?</Label>
                      <Input
                        id="mealCount"
                        type="number"
                        min="0"
                        max="5"
                        value={mealCount}
                        onChange={(e) => setMealCount(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                    
                    <Button type="submit" className="bg-mealhq-red hover:bg-mealhq-red-light">
                      Submit Meal Count
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg">
                  <p className="font-medium">Your meal count for today has been submitted!</p>
                  <p className="text-sm mt-1">You submitted {mealCount} meal(s) for today.</p>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Default Meal Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Default Meal</p>
                      <p className="text-sm text-muted-foreground">
                        This will be used if you forget to update
                      </p>
                    </div>
                    <Switch 
                      checked={defaultMealEnabled}
                      onCheckedChange={setDefaultMealEnabled}
                    />
                  </div>
                  
                  {defaultMealEnabled && (
                    <div className="space-y-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
                      <div className="space-y-2">
                        <Label htmlFor="defaultMealCount">Default Meal Count</Label>
                        <Input
                          id="defaultMealCount"
                          type="number"
                          min="0"
                          max="5"
                          value={defaultMealCount}
                          onChange={(e) => setDefaultMealCount(e.target.value)}
                          className="max-w-xs"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleDefaultMealSave}
                        variant="outline"
                      >
                        Save Default
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
