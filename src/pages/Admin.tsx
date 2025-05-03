import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  User, Utensils, Egg, Package, ShieldCheck, DollarSign, Edit, Minus, Plus 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface UserExtra {
  id: number;
  userId: number;
  description: string;
  amount: number;
  date: string;
}

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<number | null>(null);
  const [isExtraDialogOpen, setIsExtraDialogOpen] = useState(false);
  const [extraAmount, setExtraAmount] = useState('');
  const [extraDescription, setExtraDescription] = useState('');
  const navigate = useNavigate();

  // Extra item counters
  const [extraRiceCounts, setExtraRiceCounts] = useState<Record<number, number>>({});
  const [extraEggCounts, setExtraEggCounts] = useState<Record<number, number>>({});

  // Mock user data
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", lunchCount: 0, dinnerCount: 1, hasUpdated: true },
    { id: 2, name: "Jane Smith", lunchCount: 1, dinnerCount: 1, hasUpdated: true },
    { id: 3, name: "Robert Johnson", lunchCount: 0, dinnerCount: 0, hasUpdated: false },
    { id: 4, name: "Emily Wilson", lunchCount: 1, dinnerCount: 0, hasUpdated: true },
    { id: 5, name: "Michael Brown", lunchCount: 0, dinnerCount: 0, hasUpdated: false }
  ]);
  
  // Mock extra expenses data
  const [extras, setExtras] = useState<UserExtra[]>([
    { id: 1, userId: 1, description: "Extra Rice", amount: 5, date: "2025-05-01" },
    { id: 2, userId: 2, description: "Special Diet", amount: 15, date: "2025-05-02" },
    { id: 3, userId: 3, description: "Additional Protein", amount: 10, date: "2025-05-01" }
  ]);
  
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
  
  const updateMealCount = (userId: number, type: 'lunch' | 'dinner', count: number) => {
    toast.success(`Updated ${type} count for user ${userId} to ${count}`);
  };

  // Handle adding extra rice or egg items
  const handleExtraItemCount = (userId: number, itemType: 'rice' | 'egg', action: 'add' | 'remove') => {
    if (itemType === 'rice') {
      setExtraRiceCounts(prev => {
        const currentCount = prev[userId] || 0;
        const newCount = action === 'add' ? currentCount + 1 : Math.max(0, currentCount - 1);
        return { ...prev, [userId]: newCount };
      });
      
      if (action === 'add') {
        toast.success(`Added extra rice for user ${userId}`);
      } else {
        toast.info(`Removed extra rice for user ${userId}`);
      }
    } else if (itemType === 'egg') {
      setExtraEggCounts(prev => {
        const currentCount = prev[userId] || 0;
        const newCount = action === 'add' ? currentCount + 1 : Math.max(0, currentCount - 1);
        return { ...prev, [userId]: newCount };
      });
      
      if (action === 'add') {
        toast.success(`Added extra egg for user ${userId}`);
      } else {
        toast.info(`Removed extra egg for user ${userId}`);
      }
    }
  };

  // Submit extra rice or egg items
  const submitExtraItems = (userId: number) => {
    const riceCount = extraRiceCounts[userId] || 0;
    const eggCount = extraEggCounts[userId] || 0;
    
    if (riceCount === 0 && eggCount === 0) {
      toast.error("No extra items to submit");
      return;
    }
    
    let message = '';
    
    if (riceCount > 0) {
      // Add extra rice to the extras array
      setExtras([...extras, {
        id: extras.length + 1,
        userId,
        description: `${riceCount} Extra Rice`,
        amount: riceCount * 5, // Assuming $5 per rice
        date: new Date().toISOString().split('T')[0]
      }]);
      
      message += `${riceCount} rice portion${riceCount !== 1 ? 's' : ''} `;
    }
    
    if (eggCount > 0) {
      // Add extra eggs to the extras array
      setExtras([...extras, {
        id: extras.length + 1,
        userId,
        description: `${eggCount} Extra Egg`,
        amount: eggCount * 2, // Assuming $2 per egg
        date: new Date().toISOString().split('T')[0]
      }]);
      
      if (riceCount > 0) message += 'and ';
      message += `${eggCount} egg${eggCount !== 1 ? 's' : ''} `;
    }
    
    toast.success(`Added ${message}to user ${userId}`);
    
    // Reset counts for this user
    setExtraRiceCounts(prev => ({...prev, [userId]: 0}));
    setExtraEggCounts(prev => ({...prev, [userId]: 0}));
  };

  const handleTransferAdmin = () => {
    if (!selectedUser) {
      toast.error("Please select a user to transfer admin powers to");
      return;
    }

    // Here you would implement the actual admin transfer logic
    // In a real app, this would update the database to change user roles
    toast.success(`Admin powers transferred to ${selectedUser}`);
    setIsDialogOpen(false);
    
    // Set a timeout to simulate the transfer process and then log out
    setTimeout(() => {
      // Log out the current admin
      toast.info("You have been logged out as admin");
      
      // In a real application, you'd clear any auth tokens or session data here
      
      // Redirect to home page as regular user
      navigate('/home', { state: { isAdmin: false, isLoggedIn: true } });
    }, 2000);
  };

  const handleUpdateUser = (userId: number) => {
    setCurrentUser(userId);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (currentUser === null) return;
    
    toast.success(`User ${currentUser} information updated successfully`);
    setIsUpdateDialogOpen(false);
    setCurrentUser(null);
  };

  const handleExtraSpend = (userId: number) => {
    setCurrentUser(userId);
    setIsExtraDialogOpen(true);
  };

  const handleExtraSubmit = () => {
    if (currentUser === null || !extraAmount || !extraDescription) return;
    
    const amount = parseFloat(extraAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Add new extra expense
    const newExtra: UserExtra = {
      id: extras.length + 1,
      userId: currentUser,
      description: extraDescription,
      amount,
      date: new Date().toISOString().split('T')[0]
    };
    
    setExtras([...extras, newExtra]);
    toast.success(`Extra expense of $${amount} added to user ${currentUser}`);
    
    // Reset form
    setExtraAmount('');
    setExtraDescription('');
    setIsExtraDialogOpen(false);
    setCurrentUser(null);
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
          <TabsList className="grid grid-cols-4 max-w-md">
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
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Transfer</span>
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
                      <TableHead>Lunch</TableHead>
                      <TableHead>Dinner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
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
                              defaultValue={user.lunchCount} 
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateMealCount(user.id, 'lunch', newValue);
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number"
                              className="w-16 h-8" 
                              min={0}
                              defaultValue={user.dinnerCount} 
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateMealCount(user.id, 'dinner', newValue);
                              }}
                            />
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
                        <TableCell className="space-x-2">
                          {!user.hasUpdated && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => notifyUser(user.id)}
                            >
                              Notify
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateUser(user.id)}
                          >
                            <Edit size={14} className="mr-1" />
                            Update
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExtraSpend(user.id)}
                          >
                            <DollarSign size={14} className="mr-1" />
                            Add Expense
                          </Button>
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
                <CardTitle>Extra Items and Expenses</CardTitle>
                <CardDescription>
                  Manage additional items and expenses for users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Add Extra Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Rice</TableHead>
                          <TableHead>Egg</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => {
                          const riceCount = extraRiceCounts[user.id] || 0;
                          const eggCount = extraEggCounts[user.id] || 0;
                          
                          return (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleExtraItemCount(user.id, 'rice', 'remove')}
                                    disabled={riceCount === 0}
                                    className="h-8 w-8 rounded-full"
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{riceCount}</span>
                                  <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleExtraItemCount(user.id, 'rice', 'add')}
                                    className="h-8 w-8 rounded-full"
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleExtraItemCount(user.id, 'egg', 'remove')}
                                    disabled={eggCount === 0}
                                    className="h-8 w-8 rounded-full"
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{eggCount}</span>
                                  <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleExtraItemCount(user.id, 'egg', 'add')}
                                    className="h-8 w-8 rounded-full"
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-mealhq-red hover:bg-mealhq-red-light"
                                  onClick={() => submitExtraItems(user.id)}
                                  disabled={riceCount === 0 && eggCount === 0}
                                >
                                  Submit
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">User Extra Expenses</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extras.map((extra) => {
                          const user = users.find(u => u.id === extra.userId);
                          return (
                            <TableRow key={extra.id}>
                              <TableCell>{user?.name || `User ${extra.userId}`}</TableCell>
                              <TableCell>{extra.description}</TableCell>
                              <TableCell>${extra.amount.toFixed(2)}</TableCell>
                              <TableCell>{extra.date}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
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

          <TabsContent value="transfer">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Admin Rights</CardTitle>
                <CardDescription>
                  Transfer admin responsibilities to another user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    As the month ends, you can transfer admin responsibilities to another person who will manage meals for the next month.
                  </p>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="new-admin">Select New Admin</Label>
                      <Select 
                        value={selectedUser} 
                        onValueChange={setSelectedUser}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a new admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full max-w-sm"
                          disabled={!selectedUser}
                        >
                          Transfer Admin Rights
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Transfer</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to transfer admin rights to {selectedUser}? This action cannot be undone and you will be logged out as admin.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleTransferAdmin}>
                            Confirm Transfer
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Update User Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update User Information</DialogTitle>
              <DialogDescription>
                Make changes to user's details and preferences
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3" defaultValue={users.find(u => u.id === currentUser)?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dietary" className="text-right">Dietary Restrictions</Label>
                <Input id="dietary" className="col-span-3" placeholder="e.g., vegetarian, dairy-free" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preferences" className="text-right">Preferences</Label>
                <Textarea id="preferences" className="col-span-3" placeholder="Food preferences or allergies" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateSubmit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Extra Expense Dialog */}
        <Dialog open={isExtraDialogOpen} onOpenChange={setIsExtraDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Extra Expense</DialogTitle>
              <DialogDescription>
                Add a custom expense for {users.find(u => u.id === currentUser)?.name || 'user'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  className="col-span-3" 
                  placeholder="0.00"
                  value={extraAmount}
                  onChange={(e) => setExtraAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea 
                  id="description" 
                  className="col-span-3" 
                  placeholder="Describe the expense"
                  value={extraDescription}
                  onChange={(e) => setExtraDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExtraDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleExtraSubmit}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin;
