
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const [lunchCount, setLunchCount] = useState('0');
  const [dinnerCount, setDinnerCount] = useState('1');
  const [mealSubmitted, setMealSubmitted] = useState(false);
  const [defaultMealEnabled, setDefaultMealEnabled] = useState(false);
  const [defaultLunchCount, setDefaultLunchCount] = useState('0');
  const [defaultDinnerCount, setDefaultDinnerCount] = useState('1');
  const [activeTab, setActiveTab] = useState('today');

  // Mock user data
  const userData = {
    name: "John Doe",
    totalMeals: 28,
    totalLunch: 6,
    totalDinner: 22,
    joinedDate: "April 15, 2025"
  };

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success(`${lunchCount} lunch and ${dinnerCount} dinner submitted for today!`);
    setMealSubmitted(true);
  };

  const handleDefaultMealSave = () => {
    toast.success(`Default meal count set to ${defaultLunchCount} lunch and ${defaultDinnerCount} dinner`);
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Total Meals</p>
                      <p className="text-lg font-bold">{userData.totalMeals}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Lunch</p>
                      <p className="text-lg font-bold">{userData.totalLunch}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Dinner</p>
                      <p className="text-lg font-bold">{userData.totalDinner}</p>
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="today">Today's Meals</TabsTrigger>
                  <TabsTrigger value="defaults">Default Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today">
                  {!mealSubmitted ? (
                    <form onSubmit={handleMealSubmit}>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="lunchCount">How many lunch meals do you want today?</Label>
                            <Input
                              id="lunchCount"
                              type="number"
                              min="0"
                              max="5"
                              value={lunchCount}
                              onChange={(e) => setLunchCount(e.target.value)}
                              className="max-w-xs mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="dinnerCount">How many dinner meals do you want today?</Label>
                            <Input
                              id="dinnerCount"
                              type="number"
                              min="0"
                              max="5"
                              value={dinnerCount}
                              onChange={(e) => setDinnerCount(e.target.value)}
                              className="max-w-xs mt-2"
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" className="bg-mealhq-red hover:bg-mealhq-red-light">
                          Submit Meal Count
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg">
                      <p className="font-medium">Your meal count for today has been submitted!</p>
                      <p className="text-sm mt-1">You submitted {lunchCount} lunch and {dinnerCount} dinner for today.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="defaults">
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
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="defaultLunchCount">Default Lunch Count</Label>
                            <Input
                              id="defaultLunchCount"
                              type="number"
                              min="0"
                              max="5"
                              value={defaultLunchCount}
                              onChange={(e) => setDefaultLunchCount(e.target.value)}
                              className="max-w-xs mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="defaultDinnerCount">Default Dinner Count</Label>
                            <Input
                              id="defaultDinnerCount"
                              type="number"
                              min="0"
                              max="5"
                              value={defaultDinnerCount}
                              onChange={(e) => setDefaultDinnerCount(e.target.value)}
                              className="max-w-xs mt-2"
                            />
                          </div>
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
