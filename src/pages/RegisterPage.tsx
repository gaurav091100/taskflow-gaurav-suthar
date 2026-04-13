import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const RegisterPage = () => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          Create account
        </CardTitle>
        <CardDescription>
          Register to start managing projects and tasks.
        </CardDescription>
      </CardHeader>
      <RegisterForm />
      </Card>
  );
};

export default RegisterPage;