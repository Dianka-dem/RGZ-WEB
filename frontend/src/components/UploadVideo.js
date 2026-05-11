import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', videoFile);

    try {
      await axios.post('http://127.0.0.1:8001/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Видео загружено!');
      navigate('/videos');
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <h2>Загрузить видео</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} /><br/>
        <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" style={{ width: '100%', padding: 8, marginBottom: 10 }} /><br/>
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required style={{ marginBottom: 10 }} /><br/>
        <button type="submit" disabled={loading} style={{ padding: 10, background: '#28a745', color: 'white', border: 'none' }}>
          {loading ? 'Загрузка...' : 'Загрузить'}
        </button>
        <button type="button" onClick={() => navigate('/videos')} style={{ marginLeft: 10, padding: 10 }}>Отмена</button>
      </form>
    </div>
  );
}
export default UploadVideo;
