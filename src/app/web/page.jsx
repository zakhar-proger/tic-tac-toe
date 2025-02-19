"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Подключаемся к WebSocket-серверу
    const ws = new WebSocket("ws://localhost:3001");

    // Обработка входящих сообщений
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // Обработка закрытия соединения
    ws.onclose = () => {
      console.log("Соединение закрыто");
    };

    // Очистка при размонтировании компонента
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      ws.send(input);
      setInput("");
    };
  };

  return (
    <div>
      <h1>WebSocket + Next.js</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
      <div>
        <h2>Сообщения:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
