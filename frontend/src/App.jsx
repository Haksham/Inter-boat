import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFoundPage from './components/NotFoundPage';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Host from './components/Host';
import Client from './components/Client';
import Edit from './components/Edit';
import Add from './components/Add';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 my-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Host" element={<Host />} />
            <Route path="/Client/:id" element={<Client />} />
            <Route path="/client/:id/Add" element={<Add />} />
            <Route path="/client/:id/Edit/:articleId" element={<Edit />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
