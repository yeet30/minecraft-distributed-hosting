import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/login-page';
import MainPage from './pages/main-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
