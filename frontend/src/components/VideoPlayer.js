import { useParams, useNavigate } from 'react-router-dom';

function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoUrl = `http://127.0.0.1:8001/api/stream/${id}/`;

  return (
    <div>
      <h2>Просмотр видео</h2>
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      <button onClick={() => navigate('/videos')}>Назад</button>
    </div>
  );
}
export default VideoPlayer;
