
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

interface ExtraExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | undefined;
  extraAmount: string;
  setExtraAmount: (amount: string) => void;
  extraDescription: string;
  setExtraDescription: (description: string) => void;
  onSubmit: () => void;
}

const ExtraExpenseDialog: React.FC<ExtraExpenseDialogProps> = ({
  isOpen,
  onOpenChange,
  user,
  extraAmount,
  setExtraAmount,
  extraDescription,
  setExtraDescription,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Extra Expense</DialogTitle>
          <DialogDescription>
            Add a custom expense for {user?.name || 'user'}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtraExpenseDialog;
