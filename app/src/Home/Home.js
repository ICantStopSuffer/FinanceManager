import './Home.css';

import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import {React, useEffect, useState} from 'react';
import Income from './Components/Income';


function Home() {
    const [activeTab, setActiveTab] = useState('income');
    const navigate = useNavigate();

    const renderContent = () => {
        switch (activeTab) {
        case 'income':
            return <Income/>;
/*        case 'goals':
            return <Goals/>;
        case 'charts':
            return <Charts/>;
        case 'reports':
            return <Reports/>;*/
        default:
            return <div/>;
        }
    };

    return (
        <div>
            <header className="header">
                <button className="headerButton" onClick={() => setActiveTab("income")}>
                    Income
                </button>

                <button className="headerButton" onClick={() => setActiveTab("goals")}>
                    Goals
                </button>

                <button className="headerButton" onClick={() => setActiveTab("charts")}>
                    Charts
                </button>
                
                <button className="headerButton" onClick={() => setActiveTab("reports")}>
                    Reports
                </button>
            </header>
            {renderContent()}
        </div>
    );
}

export default Home;