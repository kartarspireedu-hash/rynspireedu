import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TawkChat from "@/components/TawkChat";
import MetaPixel from "@/components/MetaPixel";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import ScrollToTop from "@/components/ScrollToTop";

import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import BookDemo from "@/pages/BookDemo";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Checkout from "@/pages/Checkout";
import ContactUs from "@/pages/ContactUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import TermsOfUse from "@/pages/TermsOfUse";
import CancellationPolicy from "@/pages/CancellationPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import ChildProtection from "@/pages/ChildProtection";
import Login from "@/pages/Login";
import SetPassword from "@/pages/SetPassword";
import Register from "@/pages/Register";
import StudentDashboard from "@/pages/StudentDashboard";
import TutorDashboard from "@/pages/TutorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BookSession from "@/pages/BookSession";
import SessionRoom from "@/pages/SessionRoom";

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <BrowserRouter>
              <TawkChat />
              <MetaPixel />
              <CookieConsentBanner />
              <ScrollToTop />
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
            </BrowserRouter>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
