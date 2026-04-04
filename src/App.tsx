import './App.css'
import { HashRouter , Routes, Route } from "react-router-dom";
import LoginPage from './pages/login-page';
import MainPage from './pages/main-page';

function App() {
  return (
    <HashRouter >
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
      </Routes>
    </HashRouter >
  )
}

export default App
