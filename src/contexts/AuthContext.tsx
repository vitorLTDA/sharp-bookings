import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { User, mockLogin, mockLogout, restoreSession } from "@/lib/mockAuth";
import { loginUser, logoutUser, registerUser } from "@/api/user";
import { isAxiosError } from "axios";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<{ error: string | null }>;
	signup: (
		email: string,
		password: string,
		name: string,
		phone: string,
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

	const login: AuthContextType["login"] = async (
		email: string,
		password: string,
	) => {
		setIsLoading(true);
		if (email === "barber@elitecuts.com") {
			const result = await mockLogin(email, password);
			setUser(result.user);
			setIsLoading(false);
			return { error: result.error };
		}
		try {
			const user = await loginUser(email, password);
			if (user) {
				setUser(user);
			}
			return { error: null };
		} catch (err) {
			if (isAxiosError(err)) {
				return { error: err.response.data.error as string };
			}
		} finally {
			setIsLoading(false);
		}
	};

	const signup: AuthContextType["signup"] = async (
		email: string,
		password: string,
		name: string,
		phone: string,
	) => {
		setIsLoading(true);
		try {
			const user = await registerUser(name, email, password, phone);
			if (user) {
				setUser(user);
			}
			return { error: null };
		} catch (err) {
			return { error: err };
		} finally {
			setIsLoading(false);
		}
	};

	const loginWithGoogle = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await logoutUser();
			await mockLogout();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

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
