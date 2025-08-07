import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/DashboardHome';
import BookPage from '../pages/BookPage';
import UserPage from '../pages/UserPage';
import ReportPage from '../pages/ReportPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="book" element={<BookPage />} />
        <Route path="user" element={<UserPage />} />
        <Route path="report" element={<ReportPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
