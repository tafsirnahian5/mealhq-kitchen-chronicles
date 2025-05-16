
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Egg, Utensils } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { MealWithExtras } from '@/components/admin/types';

const MealTable = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1)); // May 2025
  const [showExtras, setShowExtras] = useState(true);
  
  // Move to previous or next month
  const goToPrevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  
  // Generate all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Mock user data
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
    { id: 4, name: "Emily Wilson" },
    { id: 5, name: "Michael Brown" },
  ];
  
  // Generate mock meal data for each user for each day
  const generateMockMealData = () => {
    const mealData: Record<number, Record<string, number>> = {};
    
    users.forEach(user => {
      const userMeals: Record<string, number> = {};
      daysInMonth.forEach(day => {
        // Randomly assign 0, 1, or 2 meals per day
        userMeals[format(day, 'yyyy-MM-dd')] = Math.floor(Math.random() * 3);
      });
      mealData[user.id] = userMeals;
    });
    
    return mealData;
  };
  
  // Generate mock extra items data
  const generateMockExtraItemsData = () => {
    const extraData: Record<number, Record<string, { rice: number, egg: number }>> = {};
    
    users.forEach(user => {
      const userExtras: Record<string, { rice: number, egg: number }> = {};
      daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        // Only add extras if there's a meal that day
        if (meals[user.id][dateStr] > 0) {
          // 30% chance for rice, 20% chance for egg
          const hasRice = Math.random() < 0.3;
          const hasEgg = Math.random() < 0.2;
          userExtras[dateStr] = {
            rice: hasRice ? Math.floor(Math.random() * 2) + 1 : 0,
            egg: hasEgg ? Math.floor(Math.random() * 2) + 1 : 0
          };
        } else {
          userExtras[dateStr] = { rice: 0, egg: 0 };
        }
      });
      extraData[user.id] = userExtras;
    });
    
    return extraData;
  };
  
  const meals = generateMockMealData();
  const extraItems = generateMockExtraItemsData();
  
  // Calculate totals
  const calculateDailyTotals = () => {
    const totals: Record<string, number> = {};
    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      totals[dateStr] = users.reduce((sum, user) => sum + (meals[user.id][dateStr] || 0), 0);
    });
    return totals;
  };
  
  const calculateUserTotals = () => {
    return users.map(user => {
      return {
        userId: user.id,
        total: daysInMonth.reduce((sum, day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          return sum + (meals[user.id][dateStr] || 0);
        }, 0)
      };
    });
  };
  
  const calculateExtraTotals = () => {
    return users.map(user => {
      let riceTotal = 0;
      let eggTotal = 0;
      
      daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        if (extraItems[user.id] && extraItems[user.id][dateStr]) {
          riceTotal += extraItems[user.id][dateStr].rice;
          eggTotal += extraItems[user.id][dateStr].egg;
        }
      });
      
      return {
        userId: user.id,
        riceTotal,
        eggTotal,
        extraTotal: riceTotal + eggTotal
      };
    });
  };
  
  const dailyTotals = calculateDailyTotals();
  const userTotals = calculateUserTotals();
  const extraTotals = calculateExtraTotals();
  
  // Calculate monthly total
  const monthlyTotal = Object.values(dailyTotals).reduce((sum: number, val: number) => sum + val, 0);
  
  // Calculate monthly data for charts
  const monthlyData: Record<string, { meals: number, satisfaction: number }> = {
    "2025-01": { meals: 165, satisfaction: 4.2 },
    "2025-02": { meals: 150, satisfaction: 4.3 },
    "2025-03": { meals: 172, satisfaction: 4.1 },
    "2025-04": { meals: 160, satisfaction: 4.5 },
    "2025-05": { meals: monthlyTotal, satisfaction: 4.4 }
  };
  
  // Calculate extra income (simplified for demo)
  const extraIncome = `$${Math.round(monthlyTotal * 1.25)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} isAdmin={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meal Table</h1>
            <p className="text-muted-foreground">Monthly meal consumption data</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft size={18} />
            </Button>
            <div className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-mealhq-beige/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Total</CardTitle>
              <CardDescription>{format(currentMonth, 'MMMM yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{monthlyTotal}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-mealhq-beige/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Average</CardTitle>
              <CardDescription>{format(currentMonth, 'MMMM yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{(monthlyTotal / daysInMonth.length).toFixed(1)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-mealhq-red/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Extra Income</CardTitle>
              <CardDescription>{format(currentMonth, 'MMMM yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{extraIncome}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowExtras(!showExtras)}
            className="text-sm"
          >
            {showExtras ? "Hide Extra Items" : "Show Extra Items"}
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Meal Overview</CardTitle>
            <CardDescription>
              Meal consumption for all users in {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium sticky left-0 bg-background z-10">User</TableHead>
                    {daysInMonth.map(day => (
                      <TableHead key={day.toString()} className="font-medium text-center">
                        <div>{format(day, 'd')}</div>
                        <div className="text-xs text-muted-foreground">{format(day, 'E')}</div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-medium">Total</TableHead>
                    {showExtras && (
                      <>
                        <TableHead className="text-center font-medium">
                          <div className="flex items-center justify-center">
                            <Utensils className="h-4 w-4 mr-1" />
                            <span>Rice</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-medium">
                          <div className="flex items-center justify-center">
                            <Egg className="h-4 w-4 mr-1" />
                            <span>Egg</span>
                          </div>
                        </TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userTotal = userTotals.find(ut => ut.userId === user.id)?.total || 0;
                    const userExtraTotal = extraTotals.find(et => et.userId === user.id);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium sticky left-0 bg-background z-10">{user.name}</TableCell>
                        {daysInMonth.map(day => {
                          const dateStr = format(day, 'yyyy-MM-dd');
                          const mealCount = meals[user.id][dateStr] || 0;
                          const hasRice = extraItems[user.id]?.[dateStr]?.rice > 0;
                          const hasEgg = extraItems[user.id]?.[dateStr]?.egg > 0;
                          
                          return (
                            <TableCell key={dateStr} className="text-center relative">
                              <span className={mealCount === 0 ? "text-muted-foreground" : ""}>
                                {mealCount}
                              </span>
                              {showExtras && mealCount > 0 && (
                                <div className="flex justify-center gap-1 mt-1 text-xs">
                                  {hasRice && (
                                    <span className="bg-amber-100 text-amber-800 rounded-full px-1">
                                      +{extraItems[user.id][dateStr].rice}R
                                    </span>
                                  )}
                                  {hasEgg && (
                                    <span className="bg-blue-100 text-blue-800 rounded-full px-1">
                                      +{extraItems[user.id][dateStr].egg}E
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center font-medium bg-secondary/50">
                          {userTotal}
                        </TableCell>
                        {showExtras && (
                          <>
                            <TableCell className="text-center font-medium bg-amber-50">
                              {userExtraTotal?.riceTotal || 0}
                            </TableCell>
                            <TableCell className="text-center font-medium bg-blue-50">
                              {userExtraTotal?.eggTotal || 0}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10">Daily Total</TableCell>
                    {daysInMonth.map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      return (
                        <TableCell key={dateStr} className="text-center font-medium">
                          {dailyTotals[dateStr]}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-medium bg-mealhq-beige/50">
                      {monthlyTotal}
                    </TableCell>
                    {showExtras && (
                      <>
                        <TableCell className="text-center font-medium bg-amber-100">
                          {extraTotals.reduce((sum, et) => sum + et.riceTotal, 0)}
                        </TableCell>
                        <TableCell className="text-center font-medium bg-blue-100">
                          {extraTotals.reduce((sum, et) => sum + et.eggTotal, 0)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MealTable;
