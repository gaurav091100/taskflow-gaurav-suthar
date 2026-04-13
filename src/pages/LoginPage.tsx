import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Sign in</CardTitle>
        <CardDescription>
          Use your TaskFlow account to continue.
        </CardDescription>
      </CardHeader>
      <LoginForm />
    </Card>
  );
};

export default LoginPage;
