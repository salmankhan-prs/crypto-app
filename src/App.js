import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/crypto/:id" element={<Crypto />}></Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
