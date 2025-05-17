
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { BarChart, FileText } from 'lucide-react';

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

  // Categorize food items by their dietary groups
  const categorizeFoodItems = () => {
    const categories = {
      proteins: ['chicken', 'beef', 'fish', 'eggs', 'tofu', 'beans', 'lentils', 'pork', 'turkey', 'lamb'],
      carbohydrates: ['rice', 'pasta', 'bread', 'potatoes', 'oats', 'quinoa', 'cereal', 'noodles'],
      vegetables: ['carrots', 'broccoli', 'spinach', 'lettuce', 'tomatoes', 'peppers', 'onions', 'garlic', 'cucumber'],
      fruits: ['apples', 'bananas', 'oranges', 'berries', 'grapes', 'melon', 'mango', 'pineapple'],
      dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
      condiments: ['salt', 'pepper', 'oil', 'vinegar', 'sauce', 'spice', 'herb'],
      other: []
    };

    const categorizedItems = {
      proteins: [] as InventoryItem[],
      carbohydrates: [] as InventoryItem[],
      vegetables: [] as InventoryItem[],
      fruits: [] as InventoryItem[],
      dairy: [] as InventoryItem[],
      condiments: [] as InventoryItem[],
      other: [] as InventoryItem[]
    };
    
    inventory.forEach(item => {
      const itemNameLower = item.item.toLowerCase();
      let categorized = false;
      
      // Check which category this item belongs to
      Object.entries(categories).forEach(([category, keywords]) => {
        if (!categorized && keywords.some(keyword => itemNameLower.includes(keyword))) {
          categorizedItems[category as keyof typeof categorizedItems].push(item);
          categorized = true;
        }
      });
      
      // If item couldn't be categorized, put it in "other"
      if (!categorized) {
        categorizedItems.other.push(item);
      }
    });
    
    return categorizedItems;
  };

  const generateNutritionalAnalysis = () => {
    const categorized = categorizeFoodItems();
    
    // Count items in each category
    const counts = {
      proteins: categorized.proteins.length,
      carbohydrates: categorized.carbohydrates.length,
      vegetables: categorized.vegetables.length,
      fruits: categorized.fruits.length,
      dairy: categorized.dairy.length,
      condiments: categorized.condiments.length,
      other: categorized.other.length
    };
    
    // Check if there's a balanced distribution across food groups
    const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const isBalanced = counts.proteins > 0 && counts.carbohydrates > 0 && 
                     (counts.vegetables > 0 || counts.fruits > 0);
    
    // Check if there's sufficient variety
    const hasVariety = totalItems >= 10 && Object.values(counts).filter(count => count > 0).length >= 4;
    
    // Check for low items to restock
    const lowItems = inventory.filter(item => item.status === 'Low');
    
    return {
      categoryCounts: counts,
      totalItems,
      isBalanced,
      hasVariety,
      lowItems,
      recommendations: []
    };
  };

  const generateShoppingList = () => {
    const lowItems = inventory.filter(item => item.status === 'Low');
    if (lowItems.length === 0) {
      toast.info('All items are in sufficient quantity');
      return;
    }
    
    const analysis = generateNutritionalAnalysis();
    const categorized = categorizeFoodItems();
    
    // Generate dietary recommendations based on analysis
    const recommendations: string[] = [];
    
    if (!analysis.isBalanced) {
      if (analysis.categoryCounts.proteins === 0) {
        recommendations.push('Add protein sources to your diet (meat, fish, eggs, or plant-based alternatives)');
      }
      if (analysis.categoryCounts.carbohydrates === 0) {
        recommendations.push('Add carbohydrate sources (rice, pasta, bread, etc.)');
      }
      if (analysis.categoryCounts.vegetables === 0 && analysis.categoryCounts.fruits === 0) {
        recommendations.push('Add fruits and vegetables for essential vitamins and minerals');
      }
    }
    
    if (!analysis.hasVariety) {
      recommendations.push('Increase the variety of foods in your inventory for a more balanced diet');
    }
    
    // Create a PDF document
    const doc = new jsPDF();
    
    // Set up document
    doc.setFontSize(20);
    doc.text('MealHQ Inventory Analysis', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Shopping List Section
    doc.setFontSize(16);
    doc.text('Shopping List (Low Stock Items)', 20, 45);
    
    let yPos = 55;
    if (lowItems.length > 0) {
      lowItems.forEach((item, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${item.item}: ${item.quantity} (${item.price})`, 25, yPos);
        yPos += 7;
      });
    } else {
      doc.setFontSize(12);
      doc.text('No items are currently low in stock', 25, yPos);
      yPos += 10;
    }
    
    // Dietary Analysis Section
    yPos += 10;
    doc.setFontSize(16);
    doc.text('Dietary Analysis', 20, yPos);
    yPos += 10;
    
    const {categoryCounts} = analysis;
    
    doc.setFontSize(12);
    doc.text('Current Inventory by Food Group:', 25, yPos);
    yPos += 7;
    doc.text(`• Proteins: ${categoryCounts.proteins} items`, 30, yPos); yPos += 7;
    doc.text(`• Carbohydrates: ${categoryCounts.carbohydrates} items`, 30, yPos); yPos += 7;
    doc.text(`• Vegetables: ${categoryCounts.vegetables} items`, 30, yPos); yPos += 7;
    doc.text(`• Fruits: ${categoryCounts.fruits} items`, 30, yPos); yPos += 7;
    doc.text(`• Dairy: ${categoryCounts.dairy} items`, 30, yPos); yPos += 7;
    doc.text(`• Condiments: ${categoryCounts.condiments} items`, 30, yPos); yPos += 7;
    doc.text(`• Other: ${categoryCounts.other} items`, 30, yPos); yPos += 7;
    
    // Diet Balance Assessment
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Diet Balance Assessment', 25, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Diet Balance: ${analysis.isBalanced ? 'Good' : 'Needs improvement'}`, 30, yPos);
    yPos += 7;
    doc.text(`Food Variety: ${analysis.hasVariety ? 'Good' : 'Could be improved'}`, 30, yPos);
    yPos += 10;
    
    // Recommendations Section
    if (recommendations.length > 0) {
      doc.setFontSize(14);
      doc.text('Recommendations:', 25, yPos);
      yPos += 10;
      
      recommendations.forEach((rec, index) => {
        doc.setFontSize(12);
        // Handle long text with wrapping
        const splitText = doc.splitTextToSize(rec, 150);
        doc.text(splitText, 30, yPos);
        yPos += splitText.length * 7 + 3;
      });
    }
    
    // Save the PDF with a name
    doc.save('MealHQ_Inventory_Analysis.pdf');
    
    toast.success('Inventory analysis PDF generated');
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
        <Button 
          onClick={generateShoppingList}
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          <span>Generate Analysis PDF</span>
        </Button>
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
