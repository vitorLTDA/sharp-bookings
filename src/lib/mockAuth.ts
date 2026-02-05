import { fetchLoggedUser } from "@/api/user";

export interface User {
	id: string;
	email: string;
	name: string;
	role: "customer" | "barber" | "admin";
	avatar?: string;
}

interface AuthResponse {
	user: User | null;
	error: string | null;
}

// Simulated user database
const mockUsers: User[] = [
	{
		id: "1",
		email: "barber@elitecuts.com",
		name: "Marcus Johnson",
		role: "barber",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
	},
	{
		id: "2",
		email: "admin@elitecuts.com",
		name: "Shop Admin",
		role: "admin",
	},
];

const AUTH_TOKEN_KEY = "elite_cuts_auth_token";
const AUTH_USER_KEY = "elite_cuts_user";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockLogin(
	email: string,
	password: string,
): Promise<AuthResponse> {
	await delay(800);

	// Find user by email
	const user = mockUsers.find(u => u.email === email);

	if (!user) {
		// For demo, create new user if not found
		if (password.length >= 6) {
			const newUser: User = {
				id: Date.now().toString(),
				email,
				name: email.split("@")[0],
				role: "customer",
			};
			localStorage.setItem(AUTH_TOKEN_KEY, "mock_token_" + newUser.id);
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
			return { user: newUser, error: null };
		}
		return { user: null, error: "Invalid email or password" };
	}

	// For demo, accept any password with 6+ chars
	if (password.length < 6) {
		return { user: null, error: "Password must be at least 6 characters" };
	}

	localStorage.setItem(AUTH_TOKEN_KEY, "mock_token_" + user.id);
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
	return { user, error: null };
}

export async function mockSignup(
	email: string,
	password: string,
	name: string,
): Promise<AuthResponse> {
	await delay(800);

	if (mockUsers.find(u => u.email === email)) {
		return { user: null, error: "Email already registered" };
	}

	if (password.length < 6) {
		return { user: null, error: "Password must be at least 6 characters" };
	}

	const newUser: User = {
		id: Date.now().toString(),
		email,
		name,
		role: "customer",
	};

	localStorage.setItem(AUTH_TOKEN_KEY, "mock_token_" + newUser.id);
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
	return { user: newUser, error: null };
}

export async function mockGoogleAuth(): Promise<AuthResponse> {
	await delay(1000);

	// Simulate Google OAuth returning a user
	const googleUser: User = {
		id: "google_" + Date.now(),
		email: "user@gmail.com",
		name: "Google User",
		role: "customer",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
	};

	localStorage.setItem(AUTH_TOKEN_KEY, "mock_google_token_" + googleUser.id);
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
	return { user: googleUser, error: null };
}

export async function mockLogout(): Promise<void> {
	await delay(300);
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);
}

export async function restoreSession(): Promise<User | null> {
	const user = await fetchLoggedUser();
	if (user) {
		return user;
	}
	await delay(200);
	const token = localStorage.getItem(AUTH_TOKEN_KEY);
	const userJson = localStorage.getItem(AUTH_USER_KEY);

	if (token && userJson) {
		try {
			return JSON.parse(userJson) as User;
		} catch {
			return null;
		}
	}
	return null;
}

// Demo helper - login as barber for testing dashboard
export async function loginAsBarber(): Promise<AuthResponse> {
	const barber = mockUsers[0];
	localStorage.setItem(AUTH_TOKEN_KEY, "mock_token_" + barber.id);
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(barber));
	return { user: barber, error: null };
}
