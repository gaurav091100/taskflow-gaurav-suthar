import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import Navbar from "./Navbar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivateRoute = ({ children }: any) => {
  const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PrivateRoute;