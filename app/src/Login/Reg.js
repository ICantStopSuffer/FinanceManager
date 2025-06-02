import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './styles.css'

function Registration() {
    const [login, setLogin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const navigate = useNavigate();

    const validatePassword = (pass) => /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(pass);
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
      };


    const onClickyClicky = async () => {

        if (!validatePassword(password)) {
            alert("Пароль должен иметь заглавные и сторчные буквы, цифры и спец символы")
            return;
        }

        if (password != password2) {
            alert("Пароли должны совпадать")
            return;
        }

        if (!validateEmail(email)) {
            alert("Неправильно введена эл.почта")
            return;
        }

        /*const response = await fetch('https://api.minote.ru/auth/register', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                login: login,
                email: email,
                password: password,
            })
        });*/
        try {
            const response = await fetch(`https://api.minote.ru/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    login: login,
                    email: email,
                    password: password,
                }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
                setIsVerifying(true);
                alert("Код отправлен на email");
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
                    <h1>Регистрация</h1>
                    <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder='Логин'/>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Эл.Почта'/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Пароль'/>
                    <input value={password2} onChange={(e) => setPassword2(e.target.value)} type='password' placeholder='Повтор пароля'/>
                    <button onClick={onClickyClicky}>Зарегистрироваться</button>
                </>)
                : (
                    <>
                        <h1>Потверждение</h1>
                        <input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} type='number' placeholder='Введите код'/>
                        <button onClick={handleVerifyCode}>Потвержденить</button>
                    </>
                )
            }
            <a href='/login'>Войти</a>
        </div>
    );
}

export default Registration;