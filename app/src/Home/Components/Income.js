import './Income.css';

import {
    BrowserRouter,
    Route,
    Routes,
    useNavigate,
} from 'react-router-dom';
import { React, useEffect, useState } from 'react';


function Income() {
    const [transactions, setTransactions] = useState([]);
    const [type, setType] = useState('income');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('https://api.minote.ru/inex/categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => alert(`${error}`, "error"));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const body = { type: '', startDate: '', endDate: '', categoryId: '' };
        fetch('https://api.minote.ru/inex/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(data => setTransactions(Array.isArray(data) ? data : []))
            .catch(error => {
                alert(`${error}`, "error");
                setTransactions([]);
            });
    });

    const handleSubmit = (e) => {
        const token = localStorage.getItem("token");
        e.preventDefault();

        if (amount <= 0) {
            alert("Сумма должна быть положительной!", "error");
            return;
        }

        const data = { type, amount, description, category_id: category };
        fetch('https://api.minote.ru/inex/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(newTransaction => {
                setTransactions(prev => [...prev, newTransaction]);
                setAmount('');
                setDescription('');
                setCategory('');
                window.location.reload();
            })
            .catch(error => alert(`${error}`, "error"));
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} в ${hours}:${minutes}`;
    };

    return (
        <div className="Main">
            <div>
                <h2>Учет</h2>
                <form className='MainForm'>
                    <div className='FormElement'>
                        <p>Тип</p>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="income">Доход</option>
                            <option value="expense">Расход</option>
                        </select>
                    </div>
                    <div className='FormElement'>
                        <p>Сумма</p>
                        <input className="form-input" type="number" placeholder="Введите сумму..." value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                    <div className='FormElement'>
                        <p>Описание</p>
                        <input className="form-input" placeholder="Введите описание..." type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='FormElement'>
                        <p>Категория</p>
                        <select className="form-select-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </form>
                <button onClick={handleSubmit}>Добавить</button>
            </div>

            <div>

                <h2>История</h2>
                <div>
                    {transactions.length > 0 ? (
                        <div className="MainHistory">
                            {transactions.map(transaction => (
                                <div className='HistoryElement' key={transaction.id}>
                                    <span>{formatDate(transaction.date)}</span>
                                    <span>
                                        {transaction.type === 'income' ? 'Доход' : 'Расход'}
                                    </span>
                                    <span>{transaction.amount} ₽</span>
                                    <span>{transaction.category_name}</span>
                                    {transaction.description && (
                                        <span>
                                            {transaction.description.length > 10
                                                ? `${transaction.description.slice(0, 10)}...`
                                                : transaction.description}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="transaction-text">Нет транзакций</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Income;