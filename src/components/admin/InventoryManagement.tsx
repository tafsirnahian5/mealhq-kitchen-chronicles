
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InventoryItem {
  id: number;
  item: string;
  quantity: string;
  status: string;
  price: string;
}

interface InventoryManagementProps {
  inventory: InventoryItem[];
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ inventory }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    status: 'Sufficient',
    price: ''
  });

  const handleUpdate = (item: InventoryItem) => {
    setCurrentItem(item);
    setFormData({
      item: item.item,
      quantity: item.quantity,
      status: item.status,
      price: item.price
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.item || !formData.quantity || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (currentItem) {
      // Update existing item
      const { error } = await supabase
        .from('inventory')
        .update({
          item: formData.item,
          quantity: formData.quantity,
          status: formData.status,
          price: formData.price
        })
        .eq('id', currentItem.id);
        
      if (error) {
        console.error('Error updating inventory item:', error);
        toast.error('Failed to update item');
      } else {
        toast.success(`${formData.item} updated successfully`);
        setIsDialogOpen(false);
        // Refresh page to see updates
        window.location.reload();
      }
    } else {
      // Add new item
      const { error } = await supabase
        .from('inventory')
        .insert({
          item: formData.item,
          quantity: formData.quantity,
          status: formData.status,
          price: formData.price
        });
        
      if (error) {
        console.error('Error adding inventory item:', error);
        toast.error('Failed to add item');
      } else {
        toast.success(`${formData.item} added to inventory`);
        setIsDialogOpen(false);
        // Refresh page to see updates
        window.location.reload();
      }
    }
  };

  const generateShoppingList = () => {
    const lowItems = inventory.filter(item => item.status === 'Low');
    if (lowItems.length === 0) {
      toast.info('All items are in sufficient quantity');
      return;
    }
    
    const shoppingList = lowItems.map(item => `${item.item}: ${item.quantity} (${item.price})`).join('\n');
    
    // In a real app, you might want to generate a PDF or send this as an email
    toast.success('Shopping list generated');
    console.log('Shopping List:');
    console.log(shoppingList);
    
    // Show a simple alert with the list
    alert('Shopping List:\n\n' + shoppingList);
  };
  
  return (
    <div>
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
                <Button variant="outline" size="sm" onClick={() => handleUpdate(item)}>Update</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 flex gap-4">
        <Button onClick={() => {
          setCurrentItem(null);
          setFormData({
            item: '',
            quantity: '',
            status: 'Sufficient',
            price: ''
          });
          setIsDialogOpen(true);
        }}>
          Add New Item
        </Button>
        <Button onClick={generateShoppingList}>Generate Shopping List</Button>
      </div>

      {/* Update/Add Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Update Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="item" className="text-right text-sm">Item</label>
              <Input 
                id="item" 
                value={formData.item} 
                onChange={(e) => setFormData({...formData, item: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right text-sm">Quantity</label>
              <Input 
                id="quantity" 
                value={formData.quantity} 
                onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                className="col-span-3" 
                placeholder="e.g. 5 kg, 10 L, 24 items" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sufficient">Sufficient</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right text-sm">Price</label>
              <Input 
                id="price" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                className="col-span-3" 
                placeholder="e.g. $25" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{currentItem ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
