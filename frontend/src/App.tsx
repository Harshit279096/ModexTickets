
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ShowsList from './pages/ShowsList';
import BookingPage from './pages/BookingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shows" element={<ShowsList />} />
        <Route path="/booking/:id" element={<BookingPage />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </AppProvider>
  );
}

export default App;
