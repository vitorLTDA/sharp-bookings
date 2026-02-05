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

export async function logoutUser() {
	try {
		await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
	} catch (error) {
		console.error("Error logging out:", error);
	}
}
