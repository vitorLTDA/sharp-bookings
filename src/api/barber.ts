import { api } from "./client";

export async function getBarbers() {
	try {
		const response = await api.get("/barbers");
		return response.data;
	} catch (error) {
		console.error("Error fetching barbers:", error);
		throw error;
	}
}
