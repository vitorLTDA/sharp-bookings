import { Scissors, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { shopInfo } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	const isBarberOrAdmin = user?.role === "barber" || user?.role === "admin";

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-2">
					<Scissors className="h-6 w-6 text-accent" />
					<span className="text-xl font-bold">{shopInfo.name}</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-6 md:flex">
					<Link
						to="/"
						className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						Home
					</Link>
					<Link
						to="/pricing"
						className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						Pricing
					</Link>
					<Link
						to="/book"
						className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						Our Team
					</Link>

					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="gap-2">
									{user?.avatar ? (
										<img
											src={user.avatar}
											alt={user.name}
											className="h-6 w-6 rounded-full object-cover"
										/>
									) : (
										<div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
											<span className="text-xs font-medium text-accent">
												{user?.name?.charAt(0)}
											</span>
										</div>
									)}
									<span className="text-sm">{user?.name}</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{isBarberOrAdmin && (
									<>
										<DropdownMenuItem asChild>
											<Link to="/dashboard" className="flex items-center gap-2">
												<LayoutDashboard className="h-4 w-4" />
												Dashboard
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
									</>
								)}
								<DropdownMenuItem
									onClick={handleLogout}
									className="flex items-center gap-2"
								>
									<LogOut className="h-4 w-4" />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Button asChild variant="ghost">
								<Link to="/auth">Login</Link>
							</Button>
							<Button
								asChild
								className="bg-accent text-accent-foreground hover:bg-accent/90"
							>
								<Link to="/book">Book Now</Link>
							</Button>
						</>
					)}
				</nav>

				{/* Mobile Menu Button */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					{isMenuOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</Button>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="border-t bg-background md:hidden">
					<nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
						<Link
							to="/"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							Home
						</Link>
						<Link
							to="/pricing"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							Pricing
						</Link>
						<Link
							to="/book"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							Our Team
						</Link>

						{isAuthenticated ? (
							<>
								{isBarberOrAdmin && (
									<Link
										to="/dashboard"
										className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
										onClick={() => setIsMenuOpen(false)}
									>
										<LayoutDashboard className="h-4 w-4" />
										Dashboard
									</Link>
								)}
								<Button
									variant="outline"
									onClick={() => {
										handleLogout();
										setIsMenuOpen(false);
									}}
								>
									<LogOut className="mr-2 h-4 w-4" />
									Sign Out
								</Button>
							</>
						) : (
							<>
								<Button asChild variant="outline">
									<Link to="/auth" onClick={() => setIsMenuOpen(false)}>
										Login
									</Link>
								</Button>
								<Button
									asChild
									className="bg-accent text-accent-foreground hover:bg-accent/90"
								>
									<Link to="/book" onClick={() => setIsMenuOpen(false)}>
										Book Now
									</Link>
								</Button>
							</>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
