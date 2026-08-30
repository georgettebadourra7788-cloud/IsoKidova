import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}
