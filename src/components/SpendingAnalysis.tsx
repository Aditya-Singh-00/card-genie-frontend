import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
            name: category.charAt(0) + category.slice(1).toLowerCase(),
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
                            <ResponsiveContainer width={280} height={280}>
                                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                    <Pie
                                        data={Object.entries(categoryBreakdown).map(([category, data]) => ({
                                            name: category.charAt(0) + category.slice(1).toLowerCase(),
                                            value: data.amount,
                                            color: categoryColors[category] || '#6B7280',
                                            percentage: data.percentage
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        labelLine={false}
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="#fff"
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                    fontWeight="bold"
                                                >
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {Object.entries(categoryBreakdown).map(([category, data], index) => (
                                            <Cell key={`cell-${index}`} fill={categoryColors[category] || '#6B7280'} />
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
                                            style={{ backgroundColor: categoryColors[category] || '#6B7280' }}
                                        />
                                        <span className="text-sm text-gray-600 font-medium">
                                            {category.charAt(0) + category.slice(1).toLowerCase()}: ₹{data.amount.toLocaleString()} ({data.percentage}%)
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
                                        you spend most on {topCategory.name} ({topCategory.percentage?.toFixed(1) || ((topCategory.value/totalExpense)*100).toFixed(1)}%)
                                        and {secondCategory.name} ({secondCategory.percentage?.toFixed(1) || ((secondCategory.value/totalExpense)*100).toFixed(1)}%).
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
