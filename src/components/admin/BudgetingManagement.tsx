
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Receipt, FileText, Plus, UserRound } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
}

interface Contribution {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  date: string;
  description: string | null;
}

const BudgetingManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [extras, setExtras] = useState<{amount: number}[]>([]);
  const [isAddingContribution, setIsAddingContribution] = useState(false);
  const [newContribution, setNewContribution] = useState({
    userId: 0,
    amount: '',
    description: ''
  });

  // Fetch data from Supabase
  useEffect(() => {
    fetchUsers();
    fetchContributions();
    fetchExtras();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name');
    
    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } else {
      setUsers(data || []);
    }
  };

  const fetchContributions = async () => {
    const { data, error } = await supabase
      .from('contributions')
      .select('id, userId, amount, date, description');
    
    if (error) {
      console.error('Error fetching contributions:', error);
      toast.error('Failed to load contributions');
    } else {
      // Join with users to get names
      const contributionsWithNames = (data || []).map(contribution => {
        const user = users.find(u => u.id === contribution.userid) || { id: contribution.userid, name: `User ${contribution.userid}` };
        return {
          id: contribution.id,
          userId: contribution.userid,
          userName: user.name,
          amount: contribution.amount,
          date: contribution.date,
          description: contribution.description
        };
      });
      setContributions(contributionsWithNames);
    }
  };

  const fetchExtras = async () => {
    const { data, error } = await supabase
      .from('extras')
      .select('amount');
    
    if (error) {
      console.error('Error fetching extras:', error);
      toast.error('Failed to load expenses');
    } else {
      setExtras(data || []);
    }
  };

  // Calculate budget summary
  const totalContributions = contributions.reduce((sum, contrib) => sum + Number(contrib.amount), 0);
  const totalSpent = extras.reduce((sum, extra) => sum + Number(extra.amount), 0);
  const remainingBudget = totalContributions - totalSpent;
  const percentageSpent = totalContributions > 0 ? (totalSpent / totalContributions) * 100 : 0;

  // Handle adding a new contribution
  const handleAddContribution = async () => {
    if (!newContribution.userId || !newContribution.amount) {
      toast.error('Please select a user and enter an amount');
      return;
    }

    const amount = parseFloat(newContribution.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const { error } = await supabase
      .from('contributions')
      .insert({
        userId: newContribution.userId,
        amount,
        description: newContribution.description || null
      });

    if (error) {
      console.error('Error adding contribution:', error);
      toast.error('Failed to add contribution');
    } else {
      toast.success('Contribution added successfully');
      // Reset form
      setNewContribution({
        userId: 0,
        amount: '',
        description: ''
      });
      setIsAddingContribution(false);
      
      // Refresh data
      fetchContributions();
      fetchExtras();
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalContributions.toFixed(2)}</div>
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
            <div className="text-2xl font-bold">${remainingBudget.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Budget Progress Bar */}
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
      
      {/* Contributions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contributions</h3>
          <Button 
            onClick={() => setIsAddingContribution(!isAddingContribution)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Contribution
          </Button>
        </div>
        
        {/* Add Contribution Form */}
        {isAddingContribution && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">User</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={newContribution.userId}
                    onChange={(e) => setNewContribution({...newContribution, userId: Number(e.target.value)})}
                  >
                    <option value={0}>Select a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Amount ($)</label>
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={newContribution.amount}
                    onChange={(e) => setNewContribution({...newContribution, amount: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <Input 
                    type="text"
                    placeholder="e.g., Monthly contribution"
                    value={newContribution.description}
                    onChange={(e) => setNewContribution({...newContribution, description: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingContribution(false)}>Cancel</Button>
                <Button onClick={handleAddContribution}>Add</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Contributions Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {contribution.userName}
                </TableCell>
                <TableCell>${Number(contribution.amount).toFixed(2)}</TableCell>
                <TableCell>{contribution.description || '-'}</TableCell>
                <TableCell>{contribution.date}</TableCell>
              </TableRow>
            ))}
            {contributions.length > 0 && (
              <TableRow className="bg-muted/50">
                <TableCell colSpan={1} className="font-bold text-right">Total:</TableCell>
                <TableCell className="font-bold">${totalContributions.toFixed(2)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            )}
            {contributions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No contributions found. Add some using the button above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BudgetingManagement;
