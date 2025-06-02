import React, { useState, useEffect } from 'react';
//import './css/goals.css';

const Goals = () => {
    // Состояния для управления целями и вводом данных
    const [goals, setGoals] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [addAmount, setAddAmount] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    // Загружаем цели при монтировании компонента
    useEffect(() => {
        fetchGoals();
    }, []);

    // Функция для получения целей с API
    const fetchGoals = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://api.minote.ru/goals/getGoals`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setGoals(data);
        } catch (error) {
            alert('Ошибка загрузки целей', 'error');
        }
    };

    // Проверка валидности даты окончания цели
    const isValidDate = (dateStr) => {
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(selectedDate.getTime()) && selectedDate >= today;
    };

    // Сброс значений ввода
    const resetInputs = () => {
        setTitle('');
        setAmount('');
        setDeadline('');
    };

    // Обработка добавления новой цели
    const handleAddGoal = async () => {
        if (!title || !amount || !deadline) {
            alert('Пожалуйста, заполните все поля.', 'error');
            return;
        }

        if (title.length > 35) {
            alert('Название цели не должно превышать 35 символов.', 'error');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Сумма должна быть положительной и больше 0.', 'error');
            return;
        }

        if (!isValidDate(deadline)) {
            alert('Дата окончания не может быть в прошлом.', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://api.minote.ru/goals/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    amount: parseFloat(amount),
                    deadline,
                }),
            });

            const data = await res.json();
            setGoals([...goals, data]);
            resetInputs();
        } catch (err) {
            alert('Ошибка при создании цели', 'error');
        }
    };

    // Обработка удаления цели
    const handleDelete = async (index) => {
        const goal = goals[index];
        try {
            const token = localStorage.getItem('token');
            await fetch(`https://api.minote.ru/goals/${goal.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoals(goals.filter((_, i) => i !== index));
            if (expandedIndex === index) setExpandedIndex(null);
        } catch (err) {
            alert('Ошибка при удалении цели', 'error');
        }
    };

    // Функция для изменения состояния расширения цели
    const handleToggleExpand = (index) => {
        const goal = goals[index];
        if (Number(goal.saved) >= Number(goal.amount)) return;
        setExpandedIndex(expandedIndex === index ? null : index);
        setEditIndex(null);
        setAddAmount('');
    };

    // Обработка добавления накопленной суммы
    const handleAddSaved = async (index) => {
        if (!addAmount || isNaN(addAmount) || parseFloat(addAmount) <= 0) {
            alert('Введите корректную сумму.', 'error');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const goal = goals[index];
            const res = await fetch(`https://api.minote.ru/goals/${goal.id}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parseFloat(addAmount) }),
            });
            const data = await res.json();
            const updated = [...goals];
            updated[index] = data;
            setGoals(updated);
            setAddAmount('');
        } catch (err) {
            alert('Ошибка при добавлении накоплений', 'error');
        }
    };

    // Обработка редактирования цели
    const handleEditGoal = async (index) => {
        if (!title || !amount || !deadline) {
            alert('Пожалуйста, заполните все поля.', 'error');
            return;
        }

        if (title.length > 35) {
            alert('Название цели не должно превышать 35 символов.', 'error');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Сумма должна быть положительной и больше 0.', 'error');
            return;
        }

        if (!isValidDate(deadline)) {
            alert('Дата окончания не может быть в прошлом.', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const goal = goals[index];
            const res = await fetch(`https://api.minote.ru/goals/${goal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    amount: parseFloat(amount),
                    deadline,
                }),
            });
            const data = await res.json();
            const updated = [...goals];
            updated[index] = data;
            setGoals(updated);
            resetInputs();
            setEditIndex(null);
            setExpandedIndex(null);
        } catch (err) {
            alert('Ошибка при редактировании цели', 'error');
        }
    };

    return (
        <div className="Main">
            <div>
                <h2>Цели</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Название"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Сумма"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    {editIndex !== null ? (
                        <button onClick={() => handleEditGoal(editIndex)}>Сохранить</button>
                    ) : (
                        <button onClick={handleAddGoal}>Добавить цель</button>
                    )}
                </div>
            </div>

            {/* Список целей */}
            <div className="MainList">
                {[...goals]
                    .map((goal, index) => ({ ...goal, originalIndex: index }))
                    .sort((a, b) => {
                        const aDone = Number(a.saved) >= Number(a.amount);
                        const bDone = Number(b.saved) >= Number(b.amount);
                        return bDone - aDone;
                    })
                    .map((goal) => {
                        const index = goal.originalIndex;
                        const isCompleted = Number(goal.saved) >= Number(goal.amount);

                        return (
                            <div
                                key={index}
                                onClick={() => handleToggleExpand(index)}
                            >
                                <div className="goal-main">
                                    <span>{goal.title}</span>
                                    <span>
                                        <br/>
                                        <b>
                                            {goal.amount} ₽
                                        </b>
                                    </span>
                                    <span>
                                        <br/>
                                        <b>
                                            До: {new Date(goal.deadline).toLocaleDateString()}
                                        </b>
                                    </span>
                                </div>

                                {isCompleted ? (
                                    <div onClick={(e) => e.stopPropagation()} >
                                        <p> Цель достигнута </p>
                                        <button onClick={() => handleDelete(index)}>Удалить</button>
                                    </div>
                                ) : (

                                    <div onClick={(e) => e.stopPropagation()}>
                                        <div>
                                            <div>
                                                <p>
                                                    <b>Накоплено:</b>{' '}
                                                    <span>
                                                        {Number(goal.saved).toFixed(2)} ₽
                                                    </span>
                                                </p>
                                                <p>
                                                    <b>Осталось:</b>{' '}
                                                    <span>
                                                        {(Number(goal.amount) - Number(goal.saved)).toFixed(2)} ₽
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            type="number"
                                            placeholder="Введите сумму..."
                                            value={addAmount}
                                            onChange={(e) => setAddAmount(e.target.value)}
                                        />
                                        <button onClick={() => handleAddSaved(index)}>
                                            Добавить сумму накопления
                                        </button>

                                        <div>
                                            <button onClick={() => handleDelete(index)}>
                                                Удалить
                                            </button>
                                        </div>
                                    </div>

                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Goals;