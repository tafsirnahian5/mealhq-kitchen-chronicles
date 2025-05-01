
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MealTable = () => {
  // Mock data for the meal table
  const mealData = {
    users: ["John", "Jane", "Robert", "Emily", "Michael"],
    dates: [
      { date: "2025-04-25", day: "Monday" },
      { date: "2025-04-26", day: "Tuesday" },
      { date: "2025-04-27", day: "Wednesday" },
      { date: "2025-04-28", day: "Thursday" },
      { date: "2025-04-29", day: "Friday" },
      { date: "2025-04-30", day: "Saturday" },
      { date: "2025-05-01", day: "Sunday" },
    ],
    meals: [
      [1, 1, 0, 1, 2, 1, 1],
      [2, 2, 1, 1, 2, 0, 0],
      [1, 1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 0],
    ],
    // Additional monthly data (simplified for demo)
    monthlyMeals: {
      "2025-04": 45, // April total
      "2025-05": 7,  // May total (just starting)
    },
    extraIncome: {
      "2025-04": "$320",
      "2025-05": "$36",
    }
  };

  const totalsByDay = mealData.meals.reduce(
    (totals, userMeals) => {
      userMeals.forEach((meal, i) => {
        totals[i] += meal;
      });
      return totals;
    },
    Array(mealData.dates.length).fill(0)
  );

  const totalsByUser = mealData.meals.map(userMeals => 
    userMeals.reduce((sum, meal) => sum + meal, 0)
  );

  const weeklyTotal = totalsByDay.reduce((sum, total) => sum + total, 0);
  
  // Calculate monthly total based on current date (May 1, 2025)
  const currentMonth = "2025-05";
  const previousMonth = "2025-04";
  const monthlyTotal = mealData.monthlyMeals[currentMonth] || 0;
  const previousMonthTotal = mealData.monthlyMeals[previousMonth] || 0;
  
  // Combined monthly total (previous + current)
  const combinedMonthlyTotal = previousMonthTotal + monthlyTotal;

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} isAdmin={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meal Table</h1>
          <p className="text-muted-foreground">Weekly meal consumption data</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-mealhq-beige/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Total</CardTitle>
              <CardDescription>Current week meals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{weeklyTotal}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-mealhq-beige/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Total</CardTitle>
              <CardDescription>May 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{monthlyTotal}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-mealhq-red/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Extra Income</CardTitle>
              <CardDescription>May 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mealData.extraIncome[currentMonth]}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                Total meals up to {mealData.dates[mealData.dates.length - 1].date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Previous Month (April):</span>
                  <span className="font-bold">{previousMonthTotal} meals</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Month (May):</span>
                  <span className="font-bold">{monthlyTotal} meals</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Combined Total:</span>
                  <span className="font-bold">{combinedMonthlyTotal} meals</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Extra Income (Combined):</span>
                  <span className="font-bold">${parseInt(mealData.extraIncome[previousMonth].replace('$', '')) + 
                    parseInt(mealData.extraIncome[currentMonth].replace('$', ''))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>
                Individual user meal counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mealData.users.map((user, index) => (
                  <div key={user} className="flex justify-between items-center">
                    <span className="font-medium">{user}:</span>
                    <span className="font-bold">{totalsByUser[index]} meals</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Meal Overview</CardTitle>
            <CardDescription>
              Meal consumption for all users over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">User</TableHead>
                    {mealData.dates.map((date, i) => (
                      <TableHead key={date.date} className="font-medium text-center">
                        <div>{date.day}</div>
                        <div className="text-xs text-muted-foreground">{date.date}</div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-medium">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealData.users.map((user, userIndex) => (
                    <TableRow key={user}>
                      <TableCell className="font-medium">{user}</TableCell>
                      {mealData.meals[userIndex].map((meal, mealIndex) => (
                        <TableCell key={mealIndex} className="text-center">
                          <span className={meal === 0 ? "text-muted-foreground" : ""}>
                            {meal}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-medium bg-secondary/50">
                        {totalsByUser[userIndex]}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">Daily Total</TableCell>
                    {totalsByDay.map((total, i) => (
                      <TableCell key={i} className="text-center font-medium">
                        {total}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium bg-mealhq-beige/50">
                      {weeklyTotal}
                    </TableCell>
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
