import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { TeamSection } from "@/components/TeamSection";
import { ContactSection } from "@/components/ContactSection";
import { Navigate } from "react-router-dom";

const Index = () => {
	return <Navigate to={"/dashboard/appointments"} replace />;
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<HeroSection />
				<TeamSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
};

export default Index;
