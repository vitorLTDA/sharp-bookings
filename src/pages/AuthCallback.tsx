import { useSearchParams } from "react-router-dom";

export function AuthCallback() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	return <div>Auth Callback Page</div>;
}
