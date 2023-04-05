// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inscription from "./components/Inscription";
import Merci from "./components/Merci";

function App() {
//  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/merci/:name" element={<Merci />} />
      </Routes>
    </Router>
  );
}

export default App
