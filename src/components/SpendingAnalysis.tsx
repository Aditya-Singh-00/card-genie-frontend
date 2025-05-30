import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Array of distinct colors for pie chart sections
const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5',
  '#00F5D4', '#FB5607', '#FF006E', '#8338EC', '#3A86FF',
  '#606C38', '#283618', '#DDA15E', '#BC6C25', '#0077B6'
];

interface CategoryData {
    amount: number;
    percentage: number;
    count: number;
}

interface SpendingAnalysisProps {
    categoryBreakdown: Record<string, CategoryData>;
    categoryColors: Record<string, string>;
}

const SpendingAnalysis: React.FC<SpendingAnalysisProps> = ({ categoryBreakdown, categoryColors }) => {
    // Calculate total expense
    const totalExpense = Object.values(categoryBreakdown).reduce((sum, data) => sum + data.amount, 0);

    // Find top categories
    const sortedCategories = Object.entries(categoryBreakdown)
        .map(([category, data]) => ({
            name: (category.charAt(0) + category.slice(1).toLowerCase()).replace(/_/g, ' '),
            value: data.amount,
            percentage: data.percentage
        }))
        .sort((a, b) => b.value - a.value);

    const topCategory = sortedCategories[0];
    const secondCategory = sortedCategories[1];

    return (
        <Card className="border-blue-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Your Spending Analysis
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-start">
                    {/* Pie Chart - Left Aligned */}
                    <div className="flex justify-start">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Expense Breakdown</h3>
                            <ResponsiveContainer width={400} height={400}>
                                <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                                    <Pie
                                        data={Object.entries(categoryBreakdown).map(([category, data], index) => ({
                                            name: (category.charAt(0) + category.slice(1).toLowerCase()).replace(/_/g, ' '),
                                            value: data.amount,
                                            color: categoryColors[category] || COLORS[index % COLORS.length],
                                            percentage: data.percentage
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={120}
                                        paddingAngle={0}
                                        dataKey="value"
                                        labelLine={true}
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                                            const RADIAN = Math.PI / 180;
                                            // Position the label outside the pie chart with appropriate space
                                            const radius = outerRadius * 1.2;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="#333"
                                                    textAnchor={x > cx ? 'start' : 'end'}
                                                    dominantBaseline="central"
                                                    fontSize="14"
                                                    fontWeight="semibold"
                                                >
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {Object.entries(categoryBreakdown).map(([category, data], index) => (
                                            <Cell key={`cell-${index}`} fill={categoryColors[category] || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Values - Left Aligned with AI Insights Below */}
                    <div className="flex flex-col justify-start">
                        {/* Values */}
                        <div className="flex flex-col justify-start mt-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Expense Values</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[2px] md:gap-x-4">
                                {Object.entries(categoryBreakdown).map(([category, data], index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: categoryColors[category] || COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-sm text-gray-600 font-medium">
                                            {(category.charAt(0) + category.slice(1).toLowerCase()).replace(/_/g, ' ')}: ₹{data.amount.toLocaleString()} ({((data.amount / totalExpense) * 100).toFixed(0)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Insights - Below Values */}
                        <div className="mt-[30px] p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">AI Insights</h4>
                            <p className="text-blue-700 mb-3">
                                Based on your spending pattern of ₹{totalExpense.toLocaleString()}/month,
                                {topCategory && secondCategory ? (
                                    <>
                                        you spend most on {topCategory.name} ({((topCategory.value/totalExpense)*100).toFixed(0)}%)
                                        and {secondCategory.name} ({((secondCategory.value/totalExpense)*100).toFixed(0)}%).
                                    </>
                                ) : (
                                    <>
                                        your spending is distributed across various categories.
                                    </>
                                )}
                                Our recommendations focus on maximizing rewards in these categories.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SpendingAnalysis;
