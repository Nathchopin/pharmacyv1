import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingModalProvider } from "@/contexts/BookingModalContext";
import { BookingModal } from "@/components/booking/BookingModal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import WeightLossPage from "./pages/WeightLossPage";
import BloodTestsPage from "./pages/BloodTestsPage";
import PharmacyFirstPage from "./pages/PharmacyFirstPage";
import HairPage from "./pages/HairPage";
import TravelPage from "./pages/TravelPage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import OnboardingPage from "./pages/OnboardingPage";
import LabResultsPage from "./pages/dashboard/LabResultsPage";
import TreatmentsPage from "./pages/dashboard/TreatmentsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PharmacistLoginPage from "@/pages/pharmacist/PharmacistLoginPage";
import PharmacistDashboardPage from "@/pages/pharmacist/PharmacistDashboardPage";
import PharmacistPatientsPage from "@/pages/pharmacist/PharmacistPatientsPage";
import PharmacistPrescriptionsPage from "@/pages/pharmacist/PharmacistPrescriptionsPage";
import PharmacistSettingsPage from "@/pages/pharmacist/PharmacistSettingsPage";
import { PharmacistLayout } from "@/components/pharmacist/PharmacistLayout";
import WeightLossStartPage from "./pages/WeightLossStartPage";
import WeightLossRecommendationPage from "./pages/WeightLossRecommendationPage";
import WeightLossDeliveryPage from "./pages/WeightLossDeliveryPage";
import WeightLossPaymentPage from "./pages/WeightLossPaymentPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookingModalProvider>
          <Toaster />
          <Sonner />
          <BookingModal />
          <BrowserRouter>
            <Routes>
              {/* PUBLIC ROUTES - No auth required */}
              <Route path="/" element={<Index />} />
              <Route path="/weight-loss" element={<WeightLossPage />} />
              <Route path="/blood-tests" element={<BloodTestsPage />} />
              <Route path="/pharmacy-first" element={<PharmacyFirstPage />} />
              <Route path="/hair" element={<HairPage />} />
              <Route path="/travel" element={<TravelPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/weight-loss/start" element={<WeightLossStartPage />} />
              <Route path="/weight-loss/recommendation" element={<WeightLossRecommendationPage />} />
              <Route path="/weight-loss/delivery" element={<WeightLossDeliveryPage />} />
              <Route path="/weight-loss/payment" element={<WeightLossPaymentPage />} />

              {/* PATIENT ROUTES - Require auth + patient role */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="patient">
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/lab-results" element={
                <ProtectedRoute requiredRole="patient">
                  <LabResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/treatments" element={
                <ProtectedRoute requiredRole="patient">
                  <TreatmentsPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/messages" element={
                <ProtectedRoute requiredRole="patient">
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute requiredRole="patient">
                  <SettingsPage />
                </ProtectedRoute>
              } />

              {/* PHARMACIST LOGIN - Public route for pharmacist authentication */}
              <Route path="/pharmacist/login" element={<PharmacistLoginPage />} />

              {/* PHARMACIST ROUTES - Require auth + pharmacist role */}
              <Route
                path="/pharmacist"
                element={
                  <ProtectedRoute requiredRole="pharmacist">
                    <PharmacistLayout>
                      <PharmacistDashboardPage />
                    </PharmacistLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pharmacist/patients"
                element={
                  <ProtectedRoute requiredRole="pharmacist">
                    <PharmacistLayout>
                      <PharmacistPatientsPage />
                    </PharmacistLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pharmacist/prescriptions"
                element={
                  <ProtectedRoute requiredRole="pharmacist">
                    <PharmacistLayout>
                      <PharmacistPrescriptionsPage />
                    </PharmacistLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pharmacist/settings"
                element={
                  <ProtectedRoute requiredRole="pharmacist">
                    <PharmacistLayout>
                      <PharmacistSettingsPage />
                    </PharmacistLayout>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>

          </BrowserRouter>
        </BookingModalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
