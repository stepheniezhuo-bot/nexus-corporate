import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import PriorityCalls from "./pages/PriorityCalls";
import CustomerDashboard from "./pages/CustomerDashboard";
import CompetitiveAnalysis from "./pages/CompetitiveAnalysis";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PriorityCalls />} />
          <Route path="/customer/:id" element={<CustomerDashboard />} />
          <Route path="/analysis" element={<CompetitiveAnalysis />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
