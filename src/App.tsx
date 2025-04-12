
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import PGDetails from "./pages/PGDetails";
import RoommateFinder from "./pages/RoommateFinder";
import RoommateQuestionnaire from "./pages/RoommateQuestionnaire";
import RoommateDetail from "./pages/RoommateDetail";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PGOwnerListing from "./pages/PGOwnerListing";
import PGListingForm from "./pages/PGListingForm";
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pg/:id" element={<PGDetails />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/roommate-finder" element={<RoommateFinder />} />
              <Route path="/roommate-questionnaire" element={<RoommateQuestionnaire />} />
              <Route path="/roommate/:id" element={<RoommateDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pg-owner-listing" element={
                <ProtectedRoute>
                  <PGOwnerListing />
                </ProtectedRoute>
              } />
              <Route path="/pg-listing-form" element={
                <ProtectedRoute>
                  <PGListingForm />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
