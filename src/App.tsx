// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "../src/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import DashBoard from "./pages/DashBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProjectDashBoard from "./pages/Project";
import CollabsDisplay from "./pages/Collabs";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          {/* Essas rotas vão usar o Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/project/:id" element={<ProjectDashBoard/>}  />
            <Route path="/collabs" element={<CollabsDisplay/>}/>
          </Route>

          {/* Essas não */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer theme="dark" />
    </ThemeProvider>
  );
}
