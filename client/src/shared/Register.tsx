import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { clearError, register } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

// Define the structure of form data before conversion to FormData
interface SignUpForm {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin"; 
}

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (formData.role) {
      form.append("role", formData.role);
    }

    try {
      const result = await dispatch(register(form));
      if (register.fulfilled.match(result)) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 border rounded"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
