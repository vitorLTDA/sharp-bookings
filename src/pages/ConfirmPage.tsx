import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { reserveSlot } from "@/api/availability";
import { ArrowLeft, Calendar, Clock, User, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { userInfoSchema } from "@/types/userInfoSchema";
import parsePhoneNumberFromString from "libphonenumber-js";

export default function ConfirmPage() {
	const navigate = useNavigate();
	const { booking, setCustomerInfo, resetBooking } = useBooking();
	const { user, isAuthenticated } = useAuth();
	const { toast } = useToast();

	const [name, setName] = useState(booking.customerName);
	const [phone, setPhone] = useState(booking.customerPhone);
	const [email, setEmail] = useState(booking.customerEmail);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const parsedPhoneNumber = useMemo(
		() => parsePhoneNumberFromString(phone, "BR"),
		[phone],
	);

	useEffect(() => {
		if (
			!booking.selectedBarber ||
			!booking.selectedDate ||
			!booking.selectedTime
		) {
			navigate("/book");
		}
	}, [booking, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
			toast({
				title: "Erro ao enviar informações",
				description: "Número de telefone inválido.",
				variant: "destructive",
			});
		}
		if (!name || !phone || !email) {
			toast({
				title: "Erro ao enviar informações",
				description: "Preencha todos os campos.",
				variant: "destructive",
			});
			return;
		}
		const parsedPhone = `${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;
		const parsedInfo = userInfoSchema.safeParse({
			name,
			phone: parsedPhone,
			email,
		});
		if (parsedInfo.error) {
			const errorMessage = JSON.parse(parsedInfo.error.message);
			toast({
				title: "Erro ao enviar informações",
				description: errorMessage[0].message,
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		setCustomerInfo(name, parsedPhone, email);

		try {
			await reserveSlot(booking.selectedSlotId!, {
				name,
				phone: parsedPhone,
				email,
			});
			setIsSubmitting(false);
			setIsConfirmed(true);
			setShowSuccessDialog(true);
		} catch {
			setIsSubmitting(false);
			toast({
				title: "Error",
				description: "Failed to reserve slot. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleConfirmReservation = async () => {
		if (!user) return;

		setIsSubmitting(true);

		try {
			await reserveSlot(booking.selectedSlotId!, {
				name: user.name || "",
				phone: user.phone || "",
				email: user.email || "",
			});
			setIsSubmitting(false);
			setIsConfirmed(true);
			setShowSuccessDialog(true);
		} catch (error) {
			setIsSubmitting(false);
			toast({
				title: "Erro",
				description: "Falha ao reservar, tente novamente.",
				variant: "destructive",
			});
		}
	};

	const handleNewBooking = () => {
		resetBooking();
		navigate("/book");
	};

	if (isConfirmed) {
		return (
			<div className="flex min-h-screen flex-col">
				<Header />
				<main className="flex-1 bg-muted py-8 md:py-12">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-md text-center">
							<div className="mb-6 flex justify-center">
								<div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-success-foreground">
									<Check className="h-10 w-10" />
								</div>
							</div>
							<h1 className="mb-2 text-3xl font-bold">Booking Confirmed!</h1>
							<p className="mb-8 text-muted-foreground">
								Your appointment has been successfully booked.
							</p>

							<Card>
								<CardContent className="p-6 text-left">
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<User className="h-5 w-5 text-accent" />
											<div>
												<p className="text-sm text-muted-foreground">Barber</p>
												<p className="font-medium">
													{booking.selectedBarber?.name}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<Calendar className="h-5 w-5 text-accent" />
											<div>
												<p className="text-sm text-muted-foreground">Date</p>
												<p className="font-medium">
													{booking.selectedDate &&
														format(booking.selectedDate, "EEEE, MMMM d, yyyy")}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<Clock className="h-5 w-5 text-accent" />
											<div>
												<p className="text-sm text-muted-foreground">Time</p>
												<p className="font-medium">{booking.selectedTime}</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className="mt-6 flex gap-4">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => navigate("/")}
								>
									Go Home
								</Button>
								<Button
									className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
									onClick={handleNewBooking}
								>
									Book Another
								</Button>
							</div>
						</div>
					</div>
				</main>
				<Footer />

				<AlertDialog
					open={showSuccessDialog}
					onOpenChange={setShowSuccessDialog}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Booking Confirmed!</AlertDialogTitle>
							<AlertDialogDescription>
								A confirmation message was sent to your WhatsApp. Please check
								it.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter className="gap-2">
							<AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
								Close
							</AlertDialogAction>
							<AlertDialogCancel onClick={() => navigate("/")}>
								Go Home
							</AlertDialogCancel>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1 bg-muted py-8 md:py-12">
				<div className="container mx-auto px-4">
					<div className="mb-8 text-center">
						<h1 className="mb-2 text-3xl font-bold">Confirm Your Booking</h1>
						<p className="text-muted-foreground">
							{isAuthenticated
								? "Review your appointment and confirm"
								: "Review your appointment and enter your details"}
						</p>
					</div>

					<div className="mx-auto max-w-lg">
						<Card className="mb-6">
							<CardHeader>
								<CardTitle>Appointment Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<User className="h-5 w-5 text-accent" />
										<div>
											<p className="text-sm text-muted-foreground">Barber</p>
											<p className="font-medium">
												{booking.selectedBarber?.name}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-accent" />
										<div>
											<p className="text-sm text-muted-foreground">Date</p>
											<p className="font-medium">
												{booking.selectedDate &&
													format(booking.selectedDate, "EEEE, MMMM d, yyyy")}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="h-5 w-5 text-accent" />
										<div>
											<p className="text-sm text-muted-foreground">Time</p>
											<p className="font-medium">{booking.selectedTime}</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{isAuthenticated ? (
							<div className="flex gap-4">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => navigate("/book/time")}
								>
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back
								</Button>
								<Button
									className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
									disabled={isSubmitting}
									onClick={handleConfirmReservation}
								>
									{isSubmitting ? "Confirming..." : "Confirm Booking"}
								</Button>
							</div>
						) : (
							<Card>
								<CardHeader>
									<CardTitle>Your Details</CardTitle>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="name">Full Name</Label>
											<Input
												id="name"
												placeholder="John Doe"
												value={name}
												onChange={e => setName(e.target.value)}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="phone">Phone Number</Label>
											<Input
												id="phone"
												type="tel"
												placeholder="(55) 91234-5678"
												value={phone}
												onChange={e => {
													const phoneNumber = parsePhoneNumberFromString(
														e.target.value,
														"BR",
													);
													setPhone(
														phoneNumber
															? phoneNumber.formatNational()
															: e.target.value,
													);
												}}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												placeholder="john@example.com"
												value={email}
												onChange={e => setEmail(e.target.value)}
												required
											/>
										</div>

										<div className="flex gap-4 pt-4">
											<Button
												type="button"
												variant="outline"
												className="flex-1"
												onClick={() => navigate("/book/time")}
											>
												<ArrowLeft className="mr-2 h-4 w-4" />
												Back
											</Button>
											<Button
												type="submit"
												className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
												disabled={isSubmitting}
											>
												{isSubmitting ? "Confirming..." : "Confirm Booking"}
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
