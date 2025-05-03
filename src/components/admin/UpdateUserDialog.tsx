
import React from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface User {
  id: number;
  name: string;
}

interface UpdateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | undefined;
  onSubmit: () => void;
}

const UpdateUserDialog: React.FC<UpdateUserDialogProps> = ({
  isOpen,
  onOpenChange,
  user,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <Input id="name" className="col-span-3" defaultValue={user?.name} />
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
