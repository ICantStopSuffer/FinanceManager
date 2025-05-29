import './App.css';
import Testpage from './testpage.js';
import Authenticator from './Auth.js';
import Registration from './Reg.js';
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
      navigate("/registration");
    }
  }, [navigate]);

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className='bigDiv'>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Testpage/></ProtectedRoute>}/>
          <Route path='/login' element={<Authenticator/>}/>
          <Route path='/registration' element={<Registration/>}/>
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;