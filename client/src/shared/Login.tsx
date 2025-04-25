import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { clearError, googleLogin, login, } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";


interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
    clientId?: string;
}

// Define proper types for Google API objects
interface GoogleAccount {
    id: {
        initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
        }) => void;
        renderButton: (
            element: HTMLElement | null,
            options: {
                theme: string;
                size: string;
                width: string;
            }
        ) => void;
    };
}

declare global {
    interface Window {
        google: {
            accounts: GoogleAccount;
        };
    }
}

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (user && token && role) {
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "user") {
                navigate("/home");
            }
        }
    }, [user, navigate]);


    useEffect(() => {
        const loadGoogleScript = () => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        };
    
        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                });
    
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-btn"),
                    {
                        theme: "outline",
                        size: "large",
                        width: "100%",
                    }
                );
            }
        };
    
        if (!window.google || !window.google.accounts) {
            loadGoogleScript();
        } else {
            initializeGoogleSignIn();
        }
    }, []);
    


    const handleGoogleCallback = async (response: GoogleCredentialResponse) => {
        try {
            const resultAction = await dispatch(googleLogin({ idToken: response.credential }));
            if (googleLogin.fulfilled.match(resultAction)) {
                const { token, user } = resultAction.payload;
                localStorage.setItem("token", token);
                localStorage.setItem("role", user.role);

                navigate("/home");
            }
        } catch (err) {
            console.error("Google login failed", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(login(formData));

        if (login.fulfilled.match(resultAction)) {
            const { token, user } = resultAction.payload;

            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role);

            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "user") {
                navigate("/home");
            } else {
                navigate("/");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <h2 className="text-3xl font-bold text-center">Login</h2>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="w-full px-3 py-2 border rounded"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 border rounded"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>

                <div id="google-signin-btn" className="flex justify-center " />

                <p className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up" className="text-blue-600 hover:underline cursor-pointer">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
