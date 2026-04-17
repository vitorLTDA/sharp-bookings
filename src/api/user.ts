import { User } from "@/lib/mockAuth";
import { api } from "./client";

export async function fetchLoggedUser() {
	try {
		const response = await api.get<User>("/users");
		return response.data;
	} catch (error) {
		console.error("Error fetching user:", error);
	}
}

export async function loginUser(email: string, password: string) {
	try {
		const response = await api.post<User>("/auth/login", {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		console.error("Error logging in:", error);
		throw error;
	}
}

export async function registerUser(
	name: string,
	email: string,
	password: string,
) {
	try {
		const response = await api.post<User>("/auth/register", {
			name,
			email,
			password,
		});
		return response.data;
	} catch (error) {
		console.error("Error registering user:", error);
		throw error;
	}
}

export async function logoutUser() {
	try {
		await api.post(`/auth/logout`);
	} catch (error) {
		console.error("Error logging out:", error);
	}
}
