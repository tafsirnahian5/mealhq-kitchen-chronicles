
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Egg, Package, ShieldCheck } from 'lucide-react';

// Import our new components
import UserManagement from '@/components/admin/UserManagement';
import ExtrasManagement from '@/components/admin/ExtrasManagement';
import InventoryManagement from '@/components/admin/InventoryManagement';
import AdminTransfer from '@/components/admin/AdminTransfer';
import UpdateUserDialog from '@/components/admin/UpdateUserDialog';
import ExtraExpenseDialog from '@/components/admin/ExtraExpenseDialog';
import { User as UserType, UserExtra, InventoryItem } from '@/components/admin/types';

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
  const [users, setUsers] = useState<UserType[]>([
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
  const inventory: InventoryItem[] = [
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

    toast.success(`Admin powers transferred to ${selectedUser}`);
    setIsDialogOpen(false);
    
    // Set a timeout to simulate the transfer process and then log out
    setTimeout(() => {
      toast.info("You have been logged out as admin");
      navigate('/home', { state: { isAdmin: false, isLoggedIn: true } });
    }, 2000);
  };

  const toggleUserUpdateStatus = (userId: number, status: boolean) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, hasUpdated: status };
      }
      return user;
    }));
    
    const statusMessage = status ? 'updated' : 'not updated';
    toast.success(`User ${userId} status set to ${statusMessage}`);
  };

  const handleUpdateAll = () => {
    // Logic to finalize all user updates
    toast.success("All user updates have been finalized");
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

  const handleUpdateSubmit = () => {
    toast.success("User information updated");
    setIsUpdateDialogOpen(false);
  };

  const currentUserObj = users.find(u => u.id === currentUser);

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
                <UserManagement 
                  users={users}
                  updateMealCount={updateMealCount}
                  notifyUser={notifyUser}
                  toggleUserUpdateStatus={toggleUserUpdateStatus}
                  handleExtraSpend={handleExtraSpend}
                  handleUpdateAll={handleUpdateAll}
                />
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
                <ExtrasManagement 
                  users={users}
                  extras={extras}
                  extraRiceCounts={extraRiceCounts}
                  extraEggCounts={extraEggCounts}
                  handleExtraItemCount={handleExtraItemCount}
                  submitExtraItems={submitExtraItems}
                />
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
                <InventoryManagement inventory={inventory} />
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
                <AdminTransfer 
                  users={users}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  handleTransferAdmin={handleTransferAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Update User Dialog */}
        <UpdateUserDialog
          isOpen={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          user={currentUserObj}
          onSubmit={handleUpdateSubmit}
        />
        
        {/* Extra Expense Dialog */}
        <ExtraExpenseDialog
          isOpen={isExtraDialogOpen}
          onOpenChange={setIsExtraDialogOpen}
          user={currentUserObj}
          extraAmount={extraAmount}
          setExtraAmount={setExtraAmount}
          extraDescription={extraDescription}
          setExtraDescription={setExtraDescription}
          onSubmit={handleExtraSubmit}
        />
      </main>
    </div>
  );
};

export default Admin;
