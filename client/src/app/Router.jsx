import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'))
const Rooms = lazy(() => import('../pages/Rooms'))
const RoomDetail = lazy(() => import('../pages/RoomDetail'))
const Halls = lazy(() => import('../pages/Halls'))
const HallDetail = lazy(() => import('../pages/HallDetail'))
const BookingSummary = lazy(() => import('../pages/BookingSummary'))
const MyBookings = lazy(() => import('../pages/MyBookings'))
const BookingDetail = lazy(() => import('../pages/BookingDetail'))
const Gallery = lazy(() => import('../pages/Gallery'))
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))
const Terms = lazy(() => import('../pages/Terms'))
const Privacy = lazy(() => import('../pages/Privacy'))
const NotFound = lazy(() => import('../pages/NotFound'))
const SignInPage = lazy(() => import('../pages/SignIn'))
const SignUpPage = lazy(() => import('../pages/SignUp'))

// Admin pages
const AdminDashboard = lazy(() => import('../features/admin/pages/Dashboard'))
const AdminBookings = lazy(() => import('../features/admin/pages/Bookings'))
const AdminRooms = lazy(() => import('../features/admin/pages/Rooms'))
const AdminHalls = lazy(() => import('../features/admin/pages/Halls'))
const AdminAvailability = lazy(() => import('../features/admin/pages/Availability'))
const AdminSettings = lazy(() => import('../features/admin/pages/Settings'))

// Layout
const MainLayout = lazy(() => import('../components/layout/MainLayout'))
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'))

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text">Loading...</div>}>
    {children}
  </Suspense>
)

const Router = () => {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Clerk Auth Routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-out" element={<Navigate to="/" replace />} />

        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="halls" element={<Halls />} />
          <Route path="halls/:id" element={<HallDetail />} />
          <Route path="booking-summary" element={<BookingSummary />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="my-bookings/:id" element={<BookingDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="halls" element={<AdminHalls />} />
          <Route path="availability" element={<AdminAvailability />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </SuspenseWrapper>
  )
}

export default Router
