
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  lunchCount: number;
  dinnerCount: number;
  hasUpdated: boolean;
}

interface UserManagementProps {
  users: User[];
  updateMealCount: (userId: number, type: 'lunch' | 'dinner', count: number) => void;
  notifyUser: (userId: number) => void;
  toggleUserUpdateStatus: (userId: number, status: boolean) => void;
  handleExtraSpend: (userId: number) => void;
  handleUpdateAll: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  updateMealCount,
  notifyUser,
  toggleUserUpdateStatus,
  handleExtraSpend,
  handleUpdateAll
}) => {
  return (
    <div>
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
                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                  user.hasUpdated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.hasUpdated ? 'Updated' : 'Not Updated'}
                </span>
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
                  onClick={() => handleExtraSpend(user.id)}
                >
                  Add Expense
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6">
        <Button 
          className="bg-mealhq-red hover:bg-mealhq-red-light"
          onClick={handleUpdateAll}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default UserManagement;
