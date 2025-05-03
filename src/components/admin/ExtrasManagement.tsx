
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface User {
  id: number;
  name: string;
  lunchCount: number;
  dinnerCount: number;
  hasUpdated: boolean;
}

interface UserExtra {
  id: number;
  userId: number;
  description: string;
  amount: number;
  date: string;
}

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
  return (
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
  );
};

export default ExtrasManagement;
