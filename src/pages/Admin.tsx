
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User, Rice, Egg, Package } from 'lucide-react';

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("users");

  // Mock user data
  const users = [
    { id: 1, name: "John Doe", mealCount: 1, hasUpdated: true },
    { id: 2, name: "Jane Smith", mealCount: 2, hasUpdated: true },
    { id: 3, name: "Robert Johnson", mealCount: 0, hasUpdated: false },
    { id: 4, name: "Emily Wilson", mealCount: 1, hasUpdated: true },
    { id: 5, name: "Michael Brown", mealCount: 0, hasUpdated: false }
  ];
  
  // Mock inventory data
  const inventory = [
    { id: 1, item: "Rice", quantity: "15 kg", status: "Sufficient", price: "$25" },
    { id: 2, item: "Oil", quantity: "5 L", status: "Sufficient", price: "$18" },
    { id: 3, item: "Chicken", quantity: "8 kg", status: "Low", price: "$45" },
    { id: 4, item: "Eggs", quantity: "24", status: "Low", price: "$8" },
    { id: 5, item: "Onions", quantity: "4 kg", status: "Sufficient", price: "$7" }
  ];

  const notifyUser = (userId: number) => {
    toast.success(`Notification sent to user ${userId}`);
  };
  
  const updateMealCount = (userId: number, count: number) => {
    toast.success(`Updated meal count for user ${userId} to ${count}`);
  };

  const addExtraItem = (userId: number, item: string) => {
    toast.success(`Added ${item} to user ${userId}'s account`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} isAdmin={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, meals, and inventory</p>
        </div>
        
        <Tabs 
          defaultValue="users" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User size={16} />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center gap-2">
              <Egg size={16} />
              <span>Extras</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package size={16} />
              <span>Inventory</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and update meal counts for all users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Today's Meals</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number"
                              className="w-16 h-8" 
                              min={0}
                              defaultValue={user.mealCount} 
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateMealCount(user.id, newValue);
                              }}
                            />
                            <span>meals</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.hasUpdated ? (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              Updated
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              Not Updated
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!user.hasUpdated && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => notifyUser(user.id)}
                            >
                              Notify
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="extras">
            <Card>
              <CardHeader>
                <CardTitle>Extra Items</CardTitle>
                <CardDescription>
                  Add extra items like rice and eggs to users' accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Add Rice</TableHead>
                      <TableHead>Add Egg</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => addExtraItem(user.id, "Rice")}
                          >
                            <Rice size={14} />
                            <span>Add Rice</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => addExtraItem(user.id, "Egg")}
                          >
                            <Egg size={14} />
                            <span>Add Egg</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Track and update your inventory and shopping list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            item.status === "Low" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Update</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6">
                  <Button>Generate Shopping List</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
