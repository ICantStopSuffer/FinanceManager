import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Testpage from './testpage.js';
import './Auth.css'

function Authenticator() {

  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const onClickyClicky = async () => {
        try {
            const response = await fetch(`https://api.minote.ru/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: login,
                    password: password,
                }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
                setIsVerifying(true);
                alert("Код отправлен на Email")
            } else {
                alert(data.error || "Ошибка сервера");
            }
          } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка сети");
          }
    }

        const handleVerifyCode = async () => {
        try {
            const response = await fetch(`https://api.minote.ru/auth/verify-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    identifier: login, 
                    code: verificationCode 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);

                navigate("/");
            } else {
                alert(data.error || "Неверный код");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка сети");
        }
    };

  return (
    <div className="Main">
      { !isVerifying ? 
        (<>
            <h1>Авторизация</h1>
            <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder='Логин'/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Пароль'/>
            <button onClick={onClickyClicky}>Войти</button>
            <a href='/registration'>Зарегистрироваться</a>
          </>)
        : (<>
          <h1>Потверждение</h1>
          <input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} type='number' placeholder='Введите код'/>
          <button onClick={handleVerifyCode}>Потвержденить</button>
        </>)
      }
    </div>
  );
}

export default Authenticator;