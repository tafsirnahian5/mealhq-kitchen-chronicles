
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';

interface User {
  id: number;
  name: string;
}

interface AdminTransferProps {
  users: User[];
  selectedUser: string | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<string | undefined>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleTransferAdmin: () => void;
}

const AdminTransfer: React.FC<AdminTransferProps> = ({
  users,
  selectedUser,
  setSelectedUser,
  isDialogOpen,
  setIsDialogOpen,
  handleTransferAdmin
}) => {
  return (
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
  );
};

export default AdminTransfer;
