import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home'
//import Sales from './dashboards/Sales';
import SignUp from './pages/SignUp';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/test" element={<SignUp />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
