import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Merci = () => {
  const { name } = useParams();
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <h1>Merci {inputValue || name} pour votre inscription</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default Merci;
