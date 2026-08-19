import "@/App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TawkChat from "@/components/TawkChat";
import MetaPixel from "@/components/MetaPixel";
import GoogleTagManager from "@/components/GoogleTagManager";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import ScrollToTop from "@/components/ScrollToTop";

// Landing loads eagerly (it's the homepage — fastest possible first paint).
// Everything else is lazy-loaded per route, splitting the single ~850KB
// bundle into smaller chunks fetched only when a visitor navigates there.
import Landing from "@/pages/Landing";
const Pricing = lazy(() => import("@/pages/Pricing"));
const About = lazy(() => import("@/pages/About"));
const BookDemo = lazy(() => import("@/pages/BookDemo"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse"));
const CancellationPolicy = lazy(() => import("@/pages/CancellationPolicy"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const ChildProtection = lazy(() => import("@/pages/ChildProtection"));
const Login = lazy(() => import("@/pages/Login"));
const SetPassword = lazy(() => import("@/pages/SetPassword"));
const Register = lazy(() => import("@/pages/Register"));
const StudentDashboard = lazy(() => import("@/pages/StudentDashboard"));
const TutorDashboard = lazy(() => import("@/pages/TutorDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const BookSession = lazy(() => import("@/pages/BookSession"));
const SessionRoom = lazy(() => import("@/pages/SessionRoom"));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <BrowserRouter>
              <TawkChat />
              <MetaPixel />
              <GoogleTagManager />
              <CookieConsentBanner />
              <ScrollToTop />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/book-demo" element={<BookDemo />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/child-protection" element={<ChildProtection />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/set-password" element={<SetPassword />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/app/student" element={<ProtectedRoute roles={["student", "parent"]}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/app/student/book" element={<ProtectedRoute roles={["student", "parent"]}><BookSession /></ProtectedRoute>} />
                  <Route path="/app/tutor" element={<ProtectedRoute roles={["tutor"]}><TutorDashboard /></ProtectedRoute>} />
                  <Route path="/app/admin" element={<ProtectedRoute roles={["admin", "owner"]}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/session/:id" element={<ProtectedRoute><SessionRoom /></ProtectedRoute>} />

                  <Route path="*" element={<Landing />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
