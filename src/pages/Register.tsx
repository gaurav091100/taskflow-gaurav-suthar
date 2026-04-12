import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../services/auth";
import { useAuth } from "../features/auth/AuthContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const data = await registerApi(form.name, form.email, form.password);
      login(data); // auto login after register
      navigate("/");
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { fields?: { email?: string } } };
      };
      if (ax.response?.status === 400) {
        setError(ax.response?.data?.fields?.email || "Registration failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl">Create account</CardTitle>
          <CardDescription>
            Register to start managing projects and tasks.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Registration issue</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="reg-name">Name</Label>
              <Input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between mt-6">
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? "Creating account…" : "Register"}
            </Button>
            <p className="text-center text-sm text-muted-foreground sm:text-right">
              Already have an account?{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default Register;