import './Home.css';

import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import {React, useEffect, useState} from 'react';
import Income from './Components/Income';
import Goals from './Components/Goals';
import Charts from './Components/Charts';
import Reports from './Components/Reports';

function Home() {
    const [activeTab, setActiveTab] = useState('income');
    const navigate = useNavigate();

    const renderContent = () => {
        switch (activeTab) {
        case 'income':
            return <Income/>;
        case 'goals':
            return <Goals/>;
       case 'charts':
            return <Charts/>;
        case 'reports':
            return <Reports/>;
        default:
            return <div/>;
        }
    };

    return (
        <div>
            <header className="header">
                <button className="headerButton" onClick={() => setActiveTab("income")}>
                    Доходы
                </button>

                <button className="headerButton" onClick={() => setActiveTab("goals")}>
                    Цели
                </button>

                <button className="headerButton" onClick={() => setActiveTab("charts")}>
                    Графики
                </button>
                
                <button className="headerButton" onClick={() => setActiveTab("reports")}>
                    Отчеты
                </button>
            </header>
            {renderContent()}
        </div>
    );
}

export default Home;