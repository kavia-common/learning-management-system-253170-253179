import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import TakeQuiz from './pages/TakeQuiz';
import AdminPanel from './pages/AdminPanel';
import CreateCourse from './pages/CreateCourse';
import CreateQuiz from './pages/CreateQuiz';
import AssignCourses from './pages/AssignCourses';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import { AuthProvider } from './context/AuthContext';

// PUBLIC_INTERFACE
export default function App() {
  /** Application root with navigation and routing (BrowserRouter provided in main.jsx) */
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-6 px-4 py-6">
          <Sidebar />
          <main className="min-w-0 grow">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="text-xl font-semibold text-gray-900">Welcome to Ocean LMS</div>
                    <p className="mt-1 text-sm text-gray-600">
                      Use the sidebar to navigate. If the app appears empty, visit{' '}
                      <Link to="/__health" className="text-blue-700 underline">/__health</Link> for a quick check.
                    </p>
                  </div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route
                path="/courses/:id/quiz"
                element={
                  <ProtectedRoute>
                    <TakeQuiz />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <RoleRoute allowed={['admin', 'trainer']}>
                    <AdminPanel />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/create-course"
                element={
                  <RoleRoute allowed={['admin', 'trainer']}>
                    <CreateCourse />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/create-quiz"
                element={
                  <RoleRoute allowed={['admin', 'trainer']}>
                    <CreateQuiz />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/assign-courses"
                element={
                  <RoleRoute allowed={['admin', 'trainer']}>
                    <AssignCourses />
                  </RoleRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
