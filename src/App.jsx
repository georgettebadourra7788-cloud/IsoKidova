import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import RedirectIfAuthed from "./components/RedirectIfAuthed.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Landing from "./screens/Landing.jsx";
import SignUp from "./screens/auth/SignUp.jsx";
import Login from "./screens/auth/Login.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Children from "./screens/Children.jsx";
import ChildDetail from "./screens/ChildDetail.jsx";
import AddChild from "./screens/AddChild.jsx";
import ReportView from "./screens/ReportView.jsx";
import ParentView from "./screens/ParentView.jsx";
import NotFound from "./screens/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthed>
            <SignUp />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route path="/share/:token" element={<ParentView />} />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell>
              <Dashboard />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/app/children"
        element={
          <RequireAuth>
            <AppShell>
              <Children />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/app/children/new"
        element={
          <RequireAuth>
            <AppShell>
              <AddChild />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/app/children/:childId"
        element={
          <RequireAuth>
            <AppShell>
              <ChildDetail />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/app/children/:childId/assess"
        element={
          <RequireAuth>
            <AppShell>
              <AddChild />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/app/reports/:reportId"
        element={
          <RequireAuth>
            <AppShell>
              <ReportView />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
