# 🎥 Videohub

**Веб-платформа для потокового видео** с возможностью загрузки, просмотра и управления видеоконтентом.

![Версия](https://img.shields.io/badge/version-1.0-blue)
![Python](https://img.shields.io/badge/Python-3.12-green)
![Django](https://img.shields.io/badge/Django-6.0.5-darkgreen)
![React](https://img.shields.io/badge/React-19-cyan)

---

## 📋 О проекте

Videohub — это полнофункциональная видеоплатформа, где пользователи могут:
- 📝 Регистрироваться и входить в аккаунт
- 📤 Загружать свои видео
- ▶️ Смотреть видео в потоковом режиме
- 📱 Использовать на любом устройстве (адаптивный дизайн)

---

## 🛠 Технологии

### Бэкенд
| Технология | Версия |
|------------|--------|
| Python | 3.12 |
| Django | 6.0.5 |
| Django REST Framework | - |
| SimpleJWT | - |
| SQLite | - |

### Фронтенд
| Технология | Версия |
|------------|--------|
| React | 19 |
| React Router DOM | 6 |
| Axios | - |
| Framer Motion | - |

---

## 🚀 Быстрый старт

### Требования
- Python 3.12+
- Node.js 18+
- Git

### Установка за 1 минуту

```bash
# 1. Скачать проект
git clone https://github.com/Dianka-dem/programming.git
cd programming

# 2. Запустить бэкенд
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# 3. Запустить фронтенд (в новом окне терминала)
cd frontend
npm install
npm start
