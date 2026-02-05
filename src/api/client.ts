import axios from "axios";

if (!import.meta.env.VITE_API_URL) {
	throw new Error(
		"API_URL not provided as env variable, please set it as 'VITE_API_URL'",
	);
}

export const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	withCredentials: true,
});
