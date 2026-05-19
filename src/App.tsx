import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/contexts/BookingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import BookPage from "./pages/BookPage";
import DateSelectPage from "./pages/DateSelectPage";
import TimeSelectPage from "./pages/TimeSelectPage";
import ConfirmPage from "./pages/ConfirmPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import AvailabilityPage from "./pages/dashboard/AvailabilityPage";
import RevenuePage from "./pages/dashboard/RevenuePage";
import ConversationsPage from "./pages/dashboard/ConversationsPage";
import NotFound from "./pages/NotFound";
import { AuthCallback } from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<AuthProvider>
				<BookingProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Index />} />
							<Route path="/auth" element={<AuthPage />} />
							<Route path="/pricing" element={<PricingPage />} />
							<Route path="/book" element={<BookPage />} />
							<Route path="/book/date" element={<DateSelectPage />} />
							<Route path="/book/time" element={<TimeSelectPage />} />
							<Route path="/book/confirm" element={<ConfirmPage />} />
							<Route path="/auth/callback" element={<AuthCallback />} />
							<Route path="/dashboard" element={<DashboardLayout />}>
								<Route index element={<DashboardPage />} />
								<Route path="appointments" element={<AppointmentsPage />} />
								<Route path="conversations" element={<ConversationsPage />} />
								<Route path="availability" element={<AvailabilityPage />} />
								<Route path="revenue" element={<RevenuePage />} />
							</Route>
							{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</BookingProvider>
			</AuthProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
