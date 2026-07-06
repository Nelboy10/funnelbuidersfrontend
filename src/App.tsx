// ============================================================
// Funnel Builders — Router Setup
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout & Guards
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';
import InstructorRoute from './components/guards/InstructorRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';

// Protected Pages
import CourseWatch from './pages/CourseWatch';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboardLayout from './pages/admin/Dashboard';
import ManageCourses from './pages/admin/ManageCourses';
import CourseForm from './pages/admin/CourseForm';
import ManageCategories from './pages/admin/ManageCategories';
import CategoryForm from './pages/admin/CategoryForm';
import ManageModules from './pages/admin/ManageModules';
import ModuleForm from './pages/admin/ModuleForm';
import VideoForm from './pages/admin/VideoForm';
import ManageUsers from './pages/admin/ManageUsers';

// Instructor Pages
import InstructorDashboardLayout from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/MyCourses';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Layout */}
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />

          {/* Protected Routes (Authenticated Users) */}
          <Route path="/courses/:slug/watch" element={
            <ProtectedRoute>
              <CourseWatch />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Dashboard Layout */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboardLayout />
          </AdminRoute>
        }>
          <Route path="courses" element={<ManageCourses />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:slug/edit" element={<CourseForm />} />
          
          <Route path="courses/:slug/modules" element={<ManageModules />} />
          <Route path="courses/:slug/modules/new" element={<ModuleForm />} />
          <Route path="courses/:slug/modules/:moduleId/edit" element={<ModuleForm />} />
          
          <Route path="courses/:slug/modules/:moduleId/videos/new" element={<VideoForm />} />
          <Route path="courses/:slug/videos/:videoId/edit" element={<VideoForm />} />
          
          <Route path="categories" element={<ManageCategories />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:slug/edit" element={<CategoryForm />} />
          
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Instructor Dashboard Layout */}
        <Route path="/instructor" element={
          <InstructorRoute>
            <InstructorDashboardLayout />
          </InstructorRoute>
        }>
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:slug/edit" element={<CourseForm />} />
          
          <Route path="courses/:slug/modules" element={<ManageModules />} />
          <Route path="courses/:slug/modules/new" element={<ModuleForm />} />
          <Route path="courses/:slug/modules/:moduleId/edit" element={<ModuleForm />} />
          
          <Route path="courses/:slug/modules/:moduleId/videos/new" element={<VideoForm />} />
          <Route path="courses/:slug/videos/:videoId/edit" element={<VideoForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
