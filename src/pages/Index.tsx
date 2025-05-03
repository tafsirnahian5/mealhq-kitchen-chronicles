
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import DashboardBox from '@/components/DashboardBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid2X2, Utensils, Calculator, Package, BarChart, StarIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [showInventory, setShowInventory] = useState(false);
  const [showSatisfaction, setShowSatisfaction] = useState(false);
  const [showMealSummary, setShowMealSummary] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Extract login state from location or default to not logged in
  const { isAdmin = false, isLoggedIn = false } = location.state || {};

  // Dummy data for the demo
  const dashboardData = {
    totalMeals: 142,
    totalLunch: 44,
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

  // Mock data for satisfaction records
  const satisfactionData = [
    { month: "Jun '24", satisfaction: 4.2 },
    { month: "Jul '24", satisfaction: 4.3 },
    { month: "Aug '24", satisfaction: 4.0 },
    { month: "Sep '24", satisfaction: 4.5 },
    { month: "Oct '24", satisfaction: 4.2 },
    { month: "Nov '24", satisfaction: 4.4 },
    { month: "Dec '24", satisfaction: 4.6 },
    { month: "Jan '25", satisfaction: 4.3 },
    { month: "Feb '25", satisfaction: 4.1 },
    { month: "Mar '25", satisfaction: 4.4 },
    { month: "Apr '25", satisfaction: 4.5 },
    { month: "May '25", satisfaction: 4.7 }
  ];

  // Mock data for meal summary by month
  const mealSummaryData = [
    { month: "Aug '24", lunch: 130, dinner: 160 },
    { month: "Sep '24", lunch: 120, dinner: 155 },
    { month: "Oct '24", lunch: 125, dinner: 165 },
    { month: "Nov '24", lunch: 135, dinner: 170 },
    { month: "Dec '24", lunch: 110, dinner: 140 },
    { month: "Jan '25", lunch: 140, dinner: 175 },
    { month: "Feb '25", lunch: 125, dinner: 165 },
    { month: "Mar '25", lunch: 135, dinner: 170 },
    { month: "Apr '25", lunch: 145, dinner: 180 },
    { month: "May '25", lunch: 150, dinner: 185 }
  ];

  const toggleInventory = () => {
    setShowInventory(!showInventory);
    if (!showInventory) {
      setShowSatisfaction(false);
      setShowMealSummary(false);
    }
  };

  const toggleSatisfaction = () => {
    setShowSatisfaction(!showSatisfaction);
    if (!showSatisfaction) {
      setShowInventory(false);
      setShowMealSummary(false);
    }
  };

  const toggleMealSummary = () => {
    setShowMealSummary(!showMealSummary);
    if (!showMealSummary) {
      setShowInventory(false);
      setShowSatisfaction(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to MealHQ</h1>
          <p className="text-muted-foreground">Your meal management dashboard</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <DashboardBox
            title="Total Meals"
            value={dashboardData.totalMeals}
            icon={<Grid2X2 size={isMobile ? 20 : 24} />}
            className="border-l-4 border-l-mealhq-red"
          />
          
          <DashboardBox
            title="Total Lunch"
            value={dashboardData.totalLunch}
            icon={<Grid2X2 size={isMobile ? 20 : 24} />}
            className="border-l-4 border-l-mealhq-beige"
          />
          
          <DashboardBox
            title="Total Dinner"
            value={dashboardData.totalDinner}
            icon={<Grid2X2 size={isMobile ? 20 : 24} />}
            className="border-l-4 border-l-mealhq-beige"
          />
          
          <DashboardBox
            title="Extra Income"
            value={dashboardData.totalExtraIncome}
            icon={<Utensils size={isMobile ? 20 : 24} />}
            className="border-l-4 border-l-mealhq-red"
          />
          
          <DashboardBox
            title="Meal Rate"
            value={dashboardData.estimatedMealRate}
            icon={<Calculator size={isMobile ? 20 : 24} />}
            className="border-l-4 border-l-mealhq-beige"
            onClick={toggleMealSummary}
          />
          
          <DashboardBox
            title="Inventory"
            value="5 items"
            icon={<Package size={isMobile ? 20 : 24} />}
            onClick={toggleInventory}
            className="border-l-4 border-l-mealhq-red"
          />

          <DashboardBox
            title="Satisfaction"
            value="4.7/5.0"
            icon={<StarIcon size={isMobile ? 20 : 24} />}
            onClick={toggleSatisfaction}
            className="border-l-4 border-l-mealhq-beige"
          />
        </div>

        {showInventory && (
          <Card className="mt-6 p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Current Inventory</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 md:px-4 text-left">Item</th>
                    <th className="py-2 px-3 md:px-4 text-left">Quantity</th>
                    <th className="py-2 px-3 md:px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.inventory.map((item, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 md:py-3 px-3 md:px-4">{item.item}</td>
                      <td className="py-2 md:py-3 px-3 md:px-4">{item.quantity}</td>
                      <td className="py-2 md:py-3 px-3 md:px-4">
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

        {showSatisfaction && (
          <Card className="mt-6 p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <h2 className="text-lg md:text-xl font-semibold mb-4">User Satisfaction Records</h2>
            <CardDescription className="mb-6">Monthly satisfaction ratings over the last year</CardDescription>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={satisfactionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#e54e4e" 
                    activeDot={{ r: 8 }} 
                    name="Satisfaction Rating"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {showMealSummary && (
          <Card className="mt-6 p-4 md:p-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Meal Summary</h2>
            <CardDescription className="mb-6">Monthly meal counts for the last 10 months</CardDescription>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={mealSummaryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lunch" name="Lunch" fill="#d9c386" />
                  <Bar dataKey="dinner" name="Dinner" fill="#e54e4e" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
