
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
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
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pg/:id" element={<ProtectedRoute><PGDetails /></ProtectedRoute>} />
            <Route path="/roommate-finder" element={<ProtectedRoute><RoommateFinder /></ProtectedRoute>} />
            <Route path="/roommate-questionnaire" element={<ProtectedRoute><RoommateQuestionnaire /></ProtectedRoute>} />
            <Route path="/roommate/:id" element={<ProtectedRoute><RoommateDetail /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/pg-owner-listing" element={<ProtectedRoute><PGOwnerListing /></ProtectedRoute>} />
            <Route path="/pg-listing-form" element={<ProtectedRoute><PGListingForm /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
