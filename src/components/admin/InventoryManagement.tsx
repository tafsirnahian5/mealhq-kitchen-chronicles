
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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
                <Button variant="outline" size="sm">Update</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6">
        <Button>Generate Shopping List</Button>
      </div>
    </div>
  );
};

export default InventoryManagement;
