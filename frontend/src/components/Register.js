import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://127.0.0.1:8001/api/register/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      setMessage('Регистрация успешна!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Ошибка: ' + (err.response?.data?.error || 'Попробуйте другой email'));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Регистрация</h2>
      {message && <div style={{ color: message.includes('успешна') ? 'green' : 'red', marginBottom: 10 }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 15 }} />
        <input type="text" placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 15 }} />
        <input type="text" placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 15 }} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 15 }} />
        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#28a745', color: 'white', border: 'none' }}>
          Зарегистрироваться
        </button>
      </form>
      <p><a href="/login">Войти</a></p>
    </div>
  );
}

export default Register;
