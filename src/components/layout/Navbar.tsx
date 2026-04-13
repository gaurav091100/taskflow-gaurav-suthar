import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name?.trim() || "Signed in";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="shrink-0 px-2 text-base font-semibold sm:text-lg"
          onClick={() => navigate("/")}
        >
          TaskFlow
        </Button>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span
            className="truncate text-sm text-muted-foreground sm:max-w-48 lg:max-w-xs"
            title={displayName}
          >
            {displayName}
          </span>
          <Separator
            orientation="vertical"
            className="hidden h-6 sm:block"
          />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
