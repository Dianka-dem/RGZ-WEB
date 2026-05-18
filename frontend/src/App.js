import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.baseURL = 'http://localhost:8000/api/';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchVideos();
    }
  }, [token]);

  useEffect(() => {
    if (selectedVideo && token) {
      fetchComments();
    }
  }, [selectedVideo, token]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('videos/');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`videos/${selectedVideo.id}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        response = await axios.post('login/', { username, password });
      } else {
        await axios.post('register/', { username, email, password });
        response = await axios.post('login/', { username, password });
      }
      const { access } = response.data;
      localStorage.setItem('token', access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setToken(access);
      await fetchVideos();
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.detail || 'Проверьте данные'));
    }
  };

  const handleLike = async (videoId) => {
    if (!token) {
      alert('Войдите чтобы поставить лайк');
      return;
    }
    try {
      const response = await axios.post(`videos/${videoId}/like/`);
      setVideos(videos.map(v => 
        v.id === videoId 
          ? { ...v, is_liked: response.data.status === 'liked', likes_count: response.data.likes_count }
          : v
      ));
      if (selectedVideo && selectedVideo.id === videoId) {
        setSelectedVideo({ ...selectedVideo, is_liked: response.data.status === 'liked', likes_count: response.data.likes_count });
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Войдите чтобы оставить комментарий');
      return;
    }
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`videos/${selectedVideo.id}/comments/`, { text: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Ошибка при отправке комментария');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      alert('Заполните название и выберите видео');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('description', uploadDescription);
    formData.append('video_file', uploadFile);
    
    try {
      await axios.post('videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchVideos();
      setShowUpload(false);
      setUploadTitle('');
      setUploadDescription('');
      setUploadFile(null);
      alert('Видео успешно загружено!');
    } catch (error) {
      alert('Ошибка загрузки видео');
    } finally {
      setUploading(false);
    }
  };

  const incrementViews = async (videoId) => {
    try {
      await axios.post(`videos/${videoId}/increment_views/`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    incrementViews(video.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setVideos([]);
    setSelectedVideo(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>🎬 VideoPlatform</h1>
              <p>Смотрите, загружайте и делитесь видео</p>
            </div>
            <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => setSelectedVideo(null)}>
            🎬 VideoPlatform
          </div>
          <div className="nav-links">
            {!selectedVideo && (
              <button onClick={() => setShowUpload(true)} className="nav-btn">
                📤 Загрузить
              </button>
            )}
            <span className="user-name">👤 {username}</span>
            <button onClick={handleLogout} className="logout-btn">Выйти</button>
          </div>
        </div>
      </nav>

      {showUpload && (
        <div className="upload-modal">
          <div className="upload-card">
            <h2>Загрузить видео</h2>
            <form onSubmit={handleUpload}>
              <input
                type="text"
                placeholder="Название видео"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Описание"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows="4"
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                required
              />
              <div className="upload-buttons">
                <button type="submit" disabled={uploading}>
                  {uploading ? 'Загрузка...' : 'Загрузить'}
                </button>
                <button type="button" onClick={() => setShowUpload(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedVideo ? (
        <div className="video-player-page">
          <button onClick={() => setSelectedVideo(null)} className="back-btn">
            ← На главную
          </button>
          
          <div className="video-player-container">
            <video
              src={`http://localhost:8000/api/videos/${selectedVideo.id}/stream_video/`}
              controls
              autoPlay
              className="video-player"
            />
            
            <div className="video-info">
              <h1>{selectedVideo.title}</h1>
              <div className="video-stats">
                <div className="stats">
                  <span>👁 {selectedVideo.views} просмотров</span>
                  <span>📅 {formatDate(selectedVideo.created_at)}</span>
                </div>
                <button 
                  onClick={() => handleLike(selectedVideo.id)} 
                  className={`like-btn ${selectedVideo.is_liked ? 'liked' : ''}`}
                >
                  {selectedVideo.is_liked ? '❤️' : '🤍'} {selectedVideo.likes_count}
                </button>
              </div>
              
              {selectedVideo.description && (
                <div className="video-description">
                  <h3>Описание</h3>
                  <p>{selectedVideo.description}</p>
                </div>
              )}
              
              <div className="video-uploader">
                <strong>Загрузил:</strong> {selectedVideo.user?.username}
              </div>
            </div>

            <div className="comments-section">
              <h3>💬 Комментарии ({comments.length})</h3>
              <form onSubmit={handleComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Напишите комментарий..."
                  rows="3"
                />
                <button type="submit">Отправить</button>
              </form>
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <strong>{comment.user?.username}</strong>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="no-comments">Нет комментариев. Будьте первым!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="videos-page">
          <div className="videos-header">
            <h1>Рекомендации</h1>
          </div>
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card" onClick={() => handleVideoSelect(video)}>
                <div className="video-thumbnail">
                  {video.thumbnail ? (
                    <img src={`http://localhost:8000${video.thumbnail}`} alt={video.title} />
                  ) : (
                    <div className="thumbnail-placeholder">🎬</div>
                  )}
                </div>
                <div className="video-card-info">
                  <h3>{video.title}</h3>
                  <p className="video-description-preview">{video.description?.substring(0, 80)}</p>
                  <div className="video-card-stats">
                    <span>👁 {video.views}</span>
                    <span>❤️ {video.likes_count}</span>
                  </div>
                  <div className="video-uploader-name">
                    {video.user?.username}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(video.id);
                    }} 
                    className={`card-like-btn ${video.is_liked ? 'liked' : ''}`}
                  >
                    {video.is_liked ? '❤️' : '🤍'} {video.likes_count}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {videos.length === 0 && (
            <div className="no-videos">
              <p>Нет видео. Загрузите первое видео!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
