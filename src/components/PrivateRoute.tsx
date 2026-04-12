import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import Navbar from "./Navbar";
import { AppMain } from "./layout/AppMain";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <AppMain>{children}</AppMain>
    </>
  );
}

export default PrivateRoute;
