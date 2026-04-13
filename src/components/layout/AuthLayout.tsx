import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}