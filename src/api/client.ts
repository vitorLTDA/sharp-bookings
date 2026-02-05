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

let isRefreshing = false;
let queue: Array<{
	resolve: (value: unknown) => void;
	reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
	queue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(null);
	});
	queue = [];
};

api.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					queue.push({ resolve, reject });
				}).then(() => api(originalRequest));
			}

			isRefreshing = true;

			try {
				await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
					method: "POST",
					credentials: "include",
				});
				processQueue(null);
				return api(originalRequest);
			} catch (err) {
				processQueue(err);
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
