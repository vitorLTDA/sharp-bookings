import { useEffect } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import {
	LayoutDashboard,
	Calendar,
	CalendarClock,
	Clock,
	DollarSign,
	LogOut,
	Scissors,
	Menu,
	MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserRoles } from "@/types/api/user"

const menuItems = [
	{ title: "Agendamentos", url: "/dashboard/appointments", icon: Calendar },
	{ title: "Disponibilidade", url: "/dashboard/availability", icon: CalendarClock },
	{ title: "Conversas", url: "/dashboard/conversations", icon: MessageSquare },
]

function DashboardSidebar() {
	const { user, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = async () => {
		await logout()
		navigate("/")
	}

	return (
		<Sidebar className="border-r">
			<SidebarContent>
				<SidebarGroup>
					<div className="flex items-center gap-2 px-4 py-4">
						<Scissors className="h-6 w-6 text-accent" />
						<span className="font-bold">Rafael Libório</span>
					</div>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink
											to={item.url}
											
											className={({ isActive }) =>
												cn(
													"flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
													isActive
														? "bg-accent/10 text-accent font-medium"
														: "text-muted-foreground hover:bg-muted hover:text-foreground",
												)
											}
										>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="mt-auto">
					<SidebarGroupContent>
						<div className="px-4 py-4 border-t">
							<div className="flex items-center gap-3 mb-3">
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt={user.name}
										className="h-8 w-8 rounded-full object-cover"
									/>
								) : (
									<div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
										<span className="text-sm font-medium text-accent">
											{user?.name?.charAt(0) || "U"}
										</span>
									</div>
								)}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{user?.name}</p>
									<p className="text-xs text-muted-foreground truncate">
										{user?.email}
									</p>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="w-full"
								onClick={handleLogout}
							>
								<LogOut className="h-4 w-4 mr-2" />
								Sair
							</Button>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

export default function DashboardLayout() {
	const { user, isLoading, isAuthenticated } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate("/auth")
		}
	}, [isLoading, isAuthenticated, navigate])

	useEffect(() => {
		// Redirect non-barber/admin users
		if (!isLoading && user && user.role === UserRoles.USER_ROLE) {
			navigate("/")
		}
	}, [isLoading, user, navigate])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" text="Carregando painel..." />
			</div>
		)
	}

	if (!isAuthenticated || !user || user.role === UserRoles.USER_ROLE) {
		return null
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full">
				<DashboardSidebar />
				<div className="flex-1 flex flex-col">
					<header className="h-14 border-b flex items-center px-4 gap-4 bg-background">
						<SidebarTrigger>
							<Menu className="h-5 w-5" />
						</SidebarTrigger>
						<h1 className="font-semibold">Painel</h1>
					</header>
					<main className="flex-1 p-6 overflow-auto bg-muted/30">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	)
}
