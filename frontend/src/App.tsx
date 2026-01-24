import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Donate from './pages/Donate'
import GetInvolved from './pages/GetInvolved';
import Events from './pages/Events'
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Beliefs from './pages/Beliefs';
import Forum from './pages/Forum';
import Devotionals from './pages/Devotionals';

function App() {

  return (
    <>
      <ScrollToTop />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/beliefs" element={<Beliefs />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/devotionals" element={<Devotionals />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path='/events' element={<Events />}/>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Add more routes here as needed */}

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
