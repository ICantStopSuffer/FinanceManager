import React, { useEffect, useState, useCallback } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import './Charts.css';

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

const Charts = () => {
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState('');
    const [adviceText, setAdviceText] = useState('');

    const fetchAllTransactions = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch('https://api.minote.ru/inex/alltransactions', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setAllTransactions(data); 
    };

    const fetchCategories = async () => {
        const res = await fetch('https://api.minote.ru/inex/categories');
        const data = await res.json();
        setCategories(data); 
    };

    const fetchTransactions = useCallback(async () => {
        const token = localStorage.getItem("token");
        const res = await fetch('https://api.minote.ru/inex/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                categoryId: selectedCategory || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            }),
        });
        const data = await res.json();
        setTransactions(data); 
    }, [selectedCategory, startDate, endDate]);

    useEffect(() => {
        fetchCategories();
        fetchAllTransactions();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const totalIncome = allTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpense = allTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const balance = Math.max(0, totalIncome - totalExpense);

    useEffect(() => {
        if (transactions.length === 0) return;

        const income = transactions
            .filter(tx => tx.type === 'income')
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const expense = transactions
            .filter(tx => tx.type === 'expense')
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const rawBalance = income - expense;

    }, [transactions]);

    const chartData = transactions.map(tx => ({
        date: new Date(tx.date).toLocaleDateString(),
        amount: tx.amount,
        category: tx.category_name,
    }));

    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const pieData = Object.values(
        transactions.reduce((acc, tx) => {
            const category = tx.category_name || 'Неизвестно';
            const amount = parseFloat(tx.amount);
            if (isNaN(amount)) return acc;

            acc[category] = acc[category] || { name: category, value: 0 };
            acc[category].value += amount;
            return acc;
        }, {})
    );

    return (
        <div>

            <div className="MainCharts">
                <h2>Графики и диаграммы</h2>
                <p>Суммарно: {totalAmount.toFixed(2)} ₽</p>
                <p>Текущий баланс: {balance.toFixed(2)} ₽</p>
            </div>

            {pieData.length > 0 && (
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={2}
                                dataKey="value"
                                labelLine={false}
                                label={({ percent, value }) =>
                                    `${(percent * 100).toFixed(2)}% (${value.toFixed(1)} ₽)`
                                }
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={`${rgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255)}`} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [`${value} ₽`, name]}
                                contentStyle={{ backgroundColor: '#eeeeee', borderColor: '#848994' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

      {/* 
            <div>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                        >
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1" spreadMethod="pad">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorBalance)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Нет транзакций для отображения</p>
                )}
            </div>
            */}
        </div>
    );
};

export default Charts;