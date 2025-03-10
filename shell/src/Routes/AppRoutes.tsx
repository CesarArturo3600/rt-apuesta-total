import { Routes, Route } from "react-router-dom";
import Login from "../components/Pages/Login";
import Search from "../components/Pages/Search";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/finder" element={<Search />} />
    </Routes>
  );
};
