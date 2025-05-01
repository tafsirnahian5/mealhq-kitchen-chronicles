
import React, { useState } from 'react';
import Header from '@/components/Header';
import DashboardBox from '@/components/DashboardBox';
import { Card } from '@/components/ui/card';
import { Grid2X2, Egg, Rice, Calculator, Package } from 'lucide-react';

const Index = () => {
  const [showInventory, setShowInventory] = useState(false);

  // Dummy data for the demo
  const dashboardData = {
    totalMeals: 142,
    totalDinner: 98,
    totalExtraIncome: "$356",
    estimatedMealRate: "$5.25",
    inventory: [
      { item: "Rice", quantity: "15 kg", status: "Sufficient" },
      { item: "Oil", quantity: "5 L", status: "Sufficient" },
      { item: "Chicken", quantity: "8 kg", status: "Low" },
      { item: "Eggs", quantity: "24", status: "Low" },
      { item: "Onions", quantity: "4 kg", status: "Sufficient" }
    ]
  };

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to MealHQ</h1>
          <p className="text-muted-foreground">Your meal management dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardBox
            title="Total Meals"
            value={dashboardData.totalMeals}
            icon={<Grid2X2 size={24} />}
            className="border-l-4 border-l-mealhq-red"
          />
          
          <DashboardBox
            title="Total Dinner"
            value={dashboardData.totalDinner}
            icon={<Grid2X2 size={24} />}
            className="border-l-4 border-l-mealhq-beige"
          />
          
          <DashboardBox
            title="Extra Income"
            value={dashboardData.totalExtraIncome}
            icon={<Rice size={24} />}
            className="border-l-4 border-l-mealhq-red"
          />
          
          <DashboardBox
            title="Estimated Meal Rate"
            value={dashboardData.estimatedMealRate}
            icon={<Calculator size={24} />}
            className="border-l-4 border-l-mealhq-beige"
          />
          
          <DashboardBox
            title="Inventory"
            value="5 items"
            icon={<Package size={24} />}
            onClick={toggleInventory}
            className="lg:col-span-2 border-l-4 border-l-mealhq-red"
          />
        </div>

        {showInventory && (
          <Card className="mt-6 p-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-4 text-left">Item</th>
                    <th className="py-2 px-4 text-left">Quantity</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.inventory.map((item, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{item.item}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          item.status === "Low" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
