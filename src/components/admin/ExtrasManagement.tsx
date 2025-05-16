
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, DollarSign, Receipt, FileText, Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { User, UserExtra, ExpenseSummary, ExtraItemRecord } from './types';
import { format } from 'date-fns';

interface ExtrasManagementProps {
  users: User[];
  extras: UserExtra[];
  extraRiceCounts: Record<number, number>;
  extraEggCounts: Record<number, number>;
  handleExtraItemCount: (userId: number, itemType: 'rice' | 'egg', action: 'add' | 'remove') => void;
  submitExtraItems: (userId: number) => void;
}

const ExtrasManagement: React.FC<ExtrasManagementProps> = ({
  users,
  extras,
  extraRiceCounts,
  extraEggCounts,
  handleExtraItemCount,
  submitExtraItems
}) => {
  const [showDailyExtras, setShowDailyExtras] = useState(false);
  const [filterDate, setFilterDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [extraItemsByUser, setExtraItemsByUser] = useState<ExtraItemRecord[]>([]);

  // Calculate expense summaries
  const totalSpent = extras.reduce((sum, extra) => sum + extra.amount, 0);
  const totalBudget = 1000; // Example budget - this could be fetched from the database
  const remaining = totalBudget - totalSpent;

  // Calculate expenses by type
  const riceExtras = extras.filter(e => e.description.includes('Rice'));
  const eggExtras = extras.filter(e => e.description.includes('Egg'));
  const otherExtras = extras.filter(e => !e.description.includes('Rice') && !e.description.includes('Egg'));
  
  const riceCount = riceExtras.length;
  const eggCount = eggExtras.length;
  const riceAmount = riceExtras.reduce((sum, e) => sum + e.amount, 0);
  const eggAmount = eggExtras.reduce((sum, e) => sum + e.amount, 0);
  const otherAmount = otherExtras.reduce((sum, e) => sum + e.amount, 0);

  // Calculate percentage spent
  const percentageSpent = (totalSpent / totalBudget) * 100;

  // Calculate today's expenses for each user
  useEffect(() => {
    // Group extras by user and date
    const todayExtras = extras.filter(extra => extra.date === filterDate);
    
    const extrasByUser: Record<number, ExtraItemRecord> = {};
    
    // Initialize with all users
    users.forEach(user => {
      extrasByUser[user.id] = {
        userId: user.id,
        userName: user.name,
        riceCount: 0,
        eggCount: 0,
        date: filterDate
      };
    });
    
    // Tally up rice and egg counts
    todayExtras.forEach(extra => {
      if (extra.description.includes('Rice')) {
        const count = parseInt(extra.description.split(' ')[0]) || 1;
        extrasByUser[extra.userId].riceCount += count;
      } else if (extra.description.includes('Egg')) {
        const count = parseInt(extra.description.split(' ')[0]) || 1;
        extrasByUser[extra.userId].eggCount += count;
      }
    });
    
    setExtraItemsByUser(Object.values(extrasByUser));
  }, [extras, users, filterDate]);

  // Helper function to validate if a user has meals today
  const validateMealCheck = (userId: number): boolean => {
    // Mock implementation - would connect to database to check if user has a meal today
    const user = users.find(u => u.id === userId);
    return user ? (user.lunchCount > 0 || user.dinnerCount > 0) : false;
  };

  // Modified handleExtraItemCount with validation
  const handleExtraItemWithValidation = (userId: number, itemType: 'rice' | 'egg', action: 'add' | 'remove') => {
    if (action === 'add' && !validateMealCheck(userId)) {
      toast.error("User must take a meal before adding extra items");
      return;
    }
    handleExtraItemCount(userId, itemType, action);
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${remaining.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Budget Usage</h4>
          <Progress value={percentageSpent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>{percentageSpent.toFixed(1)}% used</div>
            <div>{(100 - percentageSpent).toFixed(1)}% remaining</div>
          </div>
        </div>
      </div>
      
      {/* Expense Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Rice</TableCell>
              <TableCell>{riceCount}</TableCell>
              <TableCell>${riceAmount.toFixed(2)}</TableCell>
              <TableCell>{totalSpent > 0 ? ((riceAmount / totalSpent) * 100).toFixed(1) : '0'}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Egg</TableCell>
              <TableCell>{eggCount}</TableCell>
              <TableCell>${eggAmount.toFixed(2)}</TableCell>
              <TableCell>{totalSpent > 0 ? ((eggAmount / totalSpent) * 100).toFixed(1) : '0'}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Other Expenses</TableCell>
              <TableCell>{otherExtras.length}</TableCell>
              <TableCell>${otherAmount.toFixed(2)}</TableCell>
              <TableCell>{totalSpent > 0 ? ((otherAmount / totalSpent) * 100).toFixed(1) : '0'}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Add Extra Items Section */}
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
              const hasMealToday = validateMealCheck(user.id);
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {!hasMealToday && (
                      <div className="text-xs text-red-500 mt-1">
                        No meal today
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleExtraItemWithValidation(user.id, 'rice', 'remove')}
                        disabled={riceCount === 0}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-8 text-center font-medium">{riceCount}</span>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleExtraItemWithValidation(user.id, 'rice', 'add')}
                        disabled={!hasMealToday}
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
                        onClick={() => handleExtraItemWithValidation(user.id, 'egg', 'remove')}
                        disabled={eggCount === 0}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-8 text-center font-medium">{eggCount}</span>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleExtraItemWithValidation(user.id, 'egg', 'add')}
                        disabled={!hasMealToday}
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
      
      {/* Daily Extras Summary */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Daily Extra Items Summary</h3>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-2 py-1 border rounded"
            />
            <Button variant="outline" size="sm" onClick={() => setShowDailyExtras(!showDailyExtras)}>
              <Filter className="h-4 w-4 mr-1" />
              {showDailyExtras ? "Hide Summary" : "Show Summary"}
            </Button>
          </div>
        </div>
        
        {showDailyExtras && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Extra Rice</TableHead>
                <TableHead>Extra Egg</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extraItemsByUser.map((record) => (
                <TableRow key={`${record.userId}-${record.date}`}>
                  <TableCell className="font-medium">{record.userName}</TableCell>
                  <TableCell>{record.riceCount}</TableCell>
                  <TableCell>{record.eggCount}</TableCell>
                  <TableCell>{record.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* User Extra Expenses */}
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
  );
};

export default ExtrasManagement;
