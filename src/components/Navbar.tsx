import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        TaskFlow
      </h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span>{user?.name}</span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
