import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/crypto/:id" element={<Crypto />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
