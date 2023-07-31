import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(
    function () {
      if (!user) navigate("/");
    },
    [user, navigate]
  );

  return children;
}

export default ProtectedRoute;
