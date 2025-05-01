
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
    ]
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

  const grandTotal = totalsByUser.reduce((sum, total) => sum + total, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} isAdmin={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meal Table</h1>
          <p className="text-muted-foreground">Weekly meal consumption data</p>
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
                      {grandTotal}
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
