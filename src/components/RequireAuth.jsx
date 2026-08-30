import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
