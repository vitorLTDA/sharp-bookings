import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { barbers } from "@/lib/mockData";
import { useBooking } from "@/contexts/BookingContext";
import { ArrowRight } from "lucide-react";
import { getBarbers } from "@/api/barber";

export default function BookPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { booking, setSelectedBarber } = useBooking();

	// Handle pre-selected barber from URL
	useEffect(() => {
		const barberId = searchParams.get("barber");
		if (barberId) {
			const barber = barbers.find(b => b.id === barberId);
			if (barber) {
				setSelectedBarber(barber);
				navigate("/book/date");
			}
		}
		async function fetch() {
			console.log(await getBarbers());
		}
		fetch();
	}, [searchParams, setSelectedBarber, navigate]);

	const handleSelectBarber = (barber: (typeof barbers)[0]) => {
		setSelectedBarber(barber);
		navigate("/book/date");
	};

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1 bg-muted py-8 md:py-12">
				<div className="container mx-auto px-4">
					{/* Progress Indicator */}
					<div className="mb-8 flex items-center justify-center gap-2 text-sm">
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
							1
						</span>
						<span className="font-medium">Choose Barber</span>
						<ArrowRight className="h-4 w-4 text-muted-foreground" />
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
							2
						</span>
						<span className="text-muted-foreground">Select Date</span>
						<ArrowRight className="h-4 w-4 text-muted-foreground" />
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
							3
						</span>
						<span className="text-muted-foreground">Confirm</span>
					</div>

					<div className="mb-8 text-center">
						<h1 className="mb-2 text-3xl font-bold">Choose Your Barber</h1>
						<p className="text-muted-foreground">
							Select from our team of skilled professionals
						</p>
					</div>

					<div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
						{barbers.map(barber => (
							<Card
								key={barber.id}
								className={`cursor-pointer overflow-hidden transition-all hover:shadow-lg ${
									booking.selectedBarber?.id === barber.id
										? "ring-2 ring-accent"
										: ""
								}`}
								onClick={() => handleSelectBarber(barber)}
							>
								<CardContent className="p-6 text-center">
									<Avatar className="mx-auto mb-4 h-20 w-20">
										<AvatarImage src={barber.avatar} alt={barber.name} />
										<AvatarFallback className="text-lg">
											{barber.name
												.split(" ")
												.map(n => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<h3 className="mb-1 text-lg font-semibold">{barber.name}</h3>
									<p className="mb-3 text-sm text-accent">{barber.specialty}</p>
									<p className="text-sm text-muted-foreground">{barber.bio}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
