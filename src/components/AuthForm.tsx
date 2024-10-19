import React, { useState } from "react";
import { requestOtp, signIn } from "../api"; // Импортируем функции API
import "./AuthForm.css"; // Импортируем стили

const AuthForm: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpRequested, setIsOtpRequested] = useState(false);

  // Валидация телефона
  const validatePhone = (value: string) => {
    const phonePattern = /^[0-9]{11}$/; // Проверяем, что номер состоит из 11 цифр
    if (!value) return "Поле является обязательным";
    if (!phonePattern.test(value))
      return "Номер телефона должен содержать 11 цифр";
    return "";
  };

  // Валидация кода
  const validateCode = (value: string) => {
    if (!value) return "Код должен содержать 6 цифр";
    if (value.length !== 6) return "Код должен содержать 6 цифр";
    if (!/^[0-9]+$/.test(value)) return "Код должен содержать только цифры";
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhone(value);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setCode(value);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phoneError = validatePhone(phone);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    try {
      await requestOtp(phone); // Запрос OTP
      setIsOtpRequested(true); // Устанавливаем статус, что OTP был запрошен
      setError(""); // Сбрасываем ошибки
      setSuccess("OTP-код отправлен на ваш номер телефона.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Ошибка при отправке OTP.");
      } else {
        setError("Ошибка при отправке OTP."); // Общая ошибка
      }
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const codeError = validateCode(code);

    if (codeError) {
      setError(codeError);
      return;
    }

    try {
      const userData = await signIn(phone, code); // Попытка авторизации
      console.log("Данные пользователя:", userData); // Логируем данные пользователя
      setSuccess("Авторизация прошла успешно!");
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message || "Ошибка авторизации. Пожалуйста, проверьте данные."
        );
      } else {
        setError("Ошибка авторизации. Пожалуйста, проверьте данные."); // Общая ошибка
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Авторизация</h1>
      {!isOtpRequested ? (
        <form
          onSubmit={handlePhoneSubmit}
          className="form"
        >
          <div className="form-group">
            <label className="label">
              Номер телефона:
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={11}
                className="input"
              />
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button
            type="submit"
            className="button"
          >
            Запросить OTP
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleCodeSubmit}
          className="form"
        >
          <div className="form-group">
            <label className="label">
              Код:
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                className="input"
              />
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button
            type="submit"
            className="button"
          >
            Войти
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
