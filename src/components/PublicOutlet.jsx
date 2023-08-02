import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PublicOutlet() {
  const { user } = useAuth();

  return user ? <Navigate to="/app" replace={true} /> : <Outlet />;
}

export default PublicOutlet;
