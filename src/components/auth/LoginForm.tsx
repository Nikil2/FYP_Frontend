"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { login } from "@/lib/auth";
import { LoginFormData } from "@/interfaces/auth-interfaces";
import { Eye, EyeOff, Phone, Lock, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(formData);

      if (response.success) {
        // Redirect based on user role
        if (response.data?.user.role === "WORKER") {
          router.push("/worker/dashboard");
        } else if (response.data?.user.role === "CUSTOMER") {
          router.push("/customer");
        } else if (response.data?.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-heading mb-2">Welcome Back</h1>
        <p className="text-paragraph">Sign in to continue to Mehnati</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium text-heading">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="03XX-XXXXXXX"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-heading">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paragraph hover:text-heading"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-paragraph mt-4">
          Don't have an account?{" "}
          <Link href="/" className="text-tertiary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </Card>
  );
}
