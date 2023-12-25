import React from "react";
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Routes, Route
} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import FilePage from "./pages/FilePage";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/file-operations" element={<FilePage />} />
      <Route path="/register" element={<HomePage />} />
    </Routes>
  );
};

export default App;