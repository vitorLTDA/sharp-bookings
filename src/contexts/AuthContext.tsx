import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import {
	User,
	mockLogin,
	mockSignup,
	mockLogout,
	restoreSession,
} from "@/lib/mockAuth";
import { logoutUser } from "@/api/user";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<{ error: string | null }>;
	signup: (
		email: string,
		password: string,
		name: string,
	) => Promise<{ error: string | null }>;
	loginWithGoogle: () => void;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Restore session on mount
	useEffect(() => {
		restoreSession()
			.then(restoredUser => {
				setUser(restoredUser);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const result = await mockLogin(email, password);
			if (result.user) {
				setUser(result.user);
			}
			return { error: result.error };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const signup = useCallback(
		async (email: string, password: string, name: string) => {
			setIsLoading(true);
			try {
				const result = await mockSignup(email, password, name);
				if (result.user) {
					setUser(result.user);
				}
				return { error: result.error };
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const loginWithGoogle = useCallback(() => {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
	}, []);

	const logout = useCallback(async () => {
		setIsLoading(true);
		try {
			await logoutUser();
			await mockLogout();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: !!user,
				login,
				signup,
				loginWithGoogle,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
