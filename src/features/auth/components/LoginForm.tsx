import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks";
import { useAuth } from "../AuthContext";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const [form, setForm] = useState({
    email: "test@example.com",
    password: "password123",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    loginMutation.mutate(form, {
      onSuccess: (data) => {
        login(data);
        navigate("/");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        if (err?.response?.status === 401) {
          setError("Invalid email or password");
        } else {
          setError("Something went wrong");
        }
      },
    });
  };

  return (
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {(error || loginMutation.isError) && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Could not sign in</AlertTitle>
              <AlertDescription>
                {error || "Login failed"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between mt-6">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </form>
  );
};