import './App.css';
import Testpage from './testpage.js';
import Authenticator from './Login/Auth.js';
import Registration from './Login/Reg.js';
import Home from './Home/Home.js'
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import {React, useEffect} from 'react';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className='bigDiv'>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='/login' element={<Authenticator/>}/>
          <Route path='/registration' element={<Registration/>}/>
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;