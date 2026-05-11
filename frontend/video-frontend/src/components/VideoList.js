function VideoList() {
  return (
    <div>
      <h1>Мои видео</h1>
      <p>Список видео будет здесь</p>
      <button onClick={() => localStorage.removeItem('user')}>Выйти</button>
    </div>
  );
}

export default VideoList;
