import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Inscription = () => {
  const navigate = useNavigate();   // Router

  const [formJson, setFormJson] = useState({}); // stocke le JSON retourné par la requete
  const [formData, setFormData] = useState({});   // stocke les inputs


// Met a jour formJson dès l'arrivée de la requete 
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getFormJson();
      setFormJson(response);
    } catch (error) {
      console.error("Erreur lors de la récupération du formulaire :", error);
    }
  };
  fetchData();
}, []); // Appel de fetchData au montage


// Simule le retour de requete avec une latence
const getFormJson = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const myJson = {
        questions: [
          {
            title: "Parlez-nous de vous",
            fields: [
              {
                name: "first_name",
                label: "Prénom",
                type: "text",
              },
              {
                name: "last_name",
                label: "Nom",
                type: "text",
              },
              {
                name: "email",
                label: "Email",
                type: "text",
              },
              {
                name: "phone_number",
                label: "Téléphone",
                type: "text",
              },
            ],
          },
          {
            title: "Votre adresse",
            fields: [
              {
                name: "street_address",
                label: "Adresse",
                type: "text",
              },
              {
                name: "post_code",
                label: "Code postal",
                type: "text",
              },
              {
                name: "country",
                label: "Pays",
                type: "dropdown",
                options: [
                  {
                    value: "CA",
                    label: "Canada",
                  },
                  {
                    value: "US",
                    label: "USA",
                  },
                ],
              },
            ],
          },
        ],
      };
      resolve(myJson);
    }, 1000);
  });
};




    // Gere les changements de valeur des champs
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };


    const handleSubmit = async () => {
      event.preventDefault();
    
      // Envoie un POST en JSON à cette url ( https://enovode7uq1r.x.pipedream.net/ )
      const response = await fetch('https://enovode7uq1r.x.pipedream.net/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    
      if (response.ok) {
        console.log('Formulaire soumis', formData);
        const { first_name } = formData;
        navigate(`/merci/${first_name}`);
        localStorage.setItem("formData", JSON.stringify(formData));
      } else {
        console.error('Erreur lors de la soumission du formulaire');
      }
    };
    
    
  return (
    <div>
      {formJson && formJson.questions ? (
        <form onSubmit={handleSubmit}>
          {formJson.questions.map((question, index) => (
            <div key={index}>
              <h3>{question.title}</h3>
              {question.fields.map((field, index) => (
                <div key={index}>
                  <label htmlFor={field.name}>{field.label}</label>
                  {field.type === 'text' ? (
                    <input
                      type="text"
                      id={field.name}
                      name={field.name}
                      onChange={handleInputChange}
                    />
                  ) : field.type === 'dropdown' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      onChange={handleInputChange}
                    >
                      {field.options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Enregistrer</button>
        </form>
      ) : null}
    </div>
  );
  

  
};

export default Inscription;
