// api.ts
const API_URL = "https://shift-backend.onrender.com"; // Базовый URL вашего API

// Функция для запроса создания OTP
export const requestOtp = async (phone: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }), // Отправляем номер телефона в формате JSON
  });

  if (!response.ok) {
    const errorData = await response.json(); // Получаем данные об ошибке
    throw new Error(errorData.message || "Ошибка при создании OTP кода"); // Обрабатываем ошибку
  }
};

// Функция для авторизации пользователя
export const signIn = async (phone: string, code: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, code }), // Отправляем номер телефона и код
  });

  if (!response.ok) {
    const errorData = await response.json(); // Получаем данные об ошибке
    throw new Error(errorData.message || "Ошибка авторизации"); // Обрабатываем ошибку
  }

  const userData = await response.json(); // Получаем данные о пользователе
  return userData; // Возвращаем данные о пользователе для дальнейшей обработки
};
