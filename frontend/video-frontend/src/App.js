import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const isAuthenticated = localStorage.getItem('user');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/videos" element={isAuthenticated ? <VideoList /> : <Navigate to="/login" />} />
        <Route path="/video/:id" element={isAuthenticated ? <VideoPlayer /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/videos" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
