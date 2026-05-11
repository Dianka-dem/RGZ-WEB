import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function VideoList() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8001/api/videos/');
        setVideos(res.data);
      } catch (err) {
        console.error('Ошибка загрузки видео', err);
      }
    };
    fetchVideos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h1>Мои видео</h1>
      <p>Добро пожаловать, {user}!</p>
      <button onClick={() => navigate('/upload')}>+ Загрузить видео</button>
      <button onClick={handleLogout} style={{ marginLeft: 10 }}>Выйти</button>
      
      <div style={{ marginTop: 20 }}>
        {videos.length === 0 && <p>У вас пока нет видео. Нажмите "Загрузить видео".</p>}
        {videos.map(video => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <button onClick={() => navigate(`/video/${video.id}`)}>Смотреть</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default VideoList;
