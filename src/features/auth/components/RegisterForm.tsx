import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks";
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

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const registerMutation = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    registerMutation.mutate(form, {
      onSuccess: (data) => {
        login(data); // auto login
        navigate("/");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        if (err?.response?.status === 400) {
          setError(
            err?.response?.data?.fields?.email || "Registration failed"
          );
        } else {
          setError("Something went wrong");
        }
      },
    });
  };

  return (
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {(error || registerMutation.isError) && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Registration issue</AlertTitle>
              <AlertDescription>
                {error || "Registration failed"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

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
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating account…"
              : "Register"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
  );
};