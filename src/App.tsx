import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

// Layout & UI components
import { Layout } from './components/Layout';
import { ToastNotification } from './components/UI';

// Pages
import { SplashScreen } from './pages/SplashScreen';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ShopDetails } from './pages/ShopDetails';
import { ChairAvailability } from './pages/ChairAvailability';
import { SelectDate } from './pages/SelectDate';
import { SelectTime } from './pages/SelectTime';
import { BookingSummary } from './pages/BookingSummary';
import { BookingSuccess } from './pages/BookingSuccess';
import { Favorites } from './pages/Favorites';
import { UpcomingBooking } from './pages/UpcomingBooking';
import { BookingHistory } from './pages/BookingHistory';
import { Profile } from './pages/Profile';

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  return !user ? <>{children}</> : <Navigate to="/app/home" replace />;
};

function App() {
  const theme = useStore((state) => state.theme);

  // Sync HTML dark theme on mount and when theme changes
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <ToastNotification />

      <Routes>
        {/* Splash screen at root */}
        <Route path="/" element={<SplashScreen />} />

        {/* Public Login page with GuestRoute guard */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />

        {/* Protected App Routes inside layout wrapper */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect inside /app */}
          <Route index element={<Navigate to="/app/home" replace />} />
          
          {/* Sidebar/Bottom-nav main views */}
          <Route path="home" element={<Home />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="bookings" element={<UpcomingBooking />} />
          <Route path="history" element={<BookingHistory />} />
          <Route path="profile" element={<Profile />} />

          {/* Booking funnel sub-screens */}
          <Route path="shop/:shopId" element={<ShopDetails />} />
          <Route path="chairs" element={<ChairAvailability />} />
          <Route path="date" element={<SelectDate />} />
          <Route path="time" element={<SelectTime />} />
          <Route path="summary" element={<BookingSummary />} />
          <Route path="success" element={<BookingSuccess />} />
        </Route>

        {/* Fallback wildcard path redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
