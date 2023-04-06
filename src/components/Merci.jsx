import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './styles.scss';

const Merci = () => {
  const { name } = useParams();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    // on enleve les chiffres et ne garder que les lettres (dont celles avec accents), les traits d'union et les espaces
    const cleanedStr = value.replace(/[^A-Za-zÀ-ÿ -]/g, '');
    // on ne laisse pas plus de 1 espace ou trait d'union d'affilée
    const singleSpacesAndHyphensStr = cleanedStr.replace(/( |-)( |-)/g, '$1');
    // on passe tout en minuscule
    const lowercaseFormattedStr = singleSpacesAndHyphensStr.toLowerCase();
    // on passe la première lettre (et chaque première lettre après un trait d'union ou un espace) en majuscule
    let newValue = lowercaseFormattedStr.replace(/\b\w/g, (match) => match.toUpperCase());
    if (newValue.length > 100) {
      newValue = newValue.slice(0, 100);
    }
    setInputValue(newValue);
    }

    return (
      <div className="container overflow-hidden">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-lg-12 text-center">
            <h1 className="my-message">
              Merci<br />
              <span className="my-name">{inputValue || name}</span><br />
              pour votre inscription
            </h1>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="form-control mt-5"
            />
          </div>
        </div>
      </div>
    );
    

};

export default Merci;
