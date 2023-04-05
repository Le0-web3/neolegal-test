
    
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Inscription = () => {
  const navigate = useNavigate();   // Router
  const [formJson, setFormJson] = useState({}); // stocke le JSON retourné par la requete
  const [formData, setFormData] = useState({});   // stocke les inputs

  //   -----   GET JSON   -----
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

  //   -----   INPUTS   -----
  function formatPhoneNumber(input) {
    // Enlever tous les caractères qui ne sont pas des chiffres
    const phoneNumber = input.replace(/\D/g, '');

    // Vérifier si le numéro de téléphone est vide
    if (phoneNumber === '') {
      return '';
    }

    // Mettre en forme le numéro de téléphone en ajoutant les parenthèses et les tirets
    let formattedPhoneNumber = `(${phoneNumber.slice(0, 3)}`;
    if (phoneNumber.length > 3) {
      formattedPhoneNumber += `) ${phoneNumber.slice(3, 6)}`;
    }
    if (phoneNumber.length > 6) {
      formattedPhoneNumber += `-${phoneNumber.slice(6, 10)}`;
    }
    
    return formattedPhoneNumber;
  }

  // Gère les changements de valeur des champs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if(name === "phone_number") {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };



  //   -----   OUTPUTS   -----
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Vérification du format du numéro de téléphone avant POST
    const phoneNumberRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Regex pour le format (xxx) xxx-xxxx
    const isValidPhoneNumber = phoneNumberRegex.test(formData.phone_number);
    if (!isValidPhoneNumber) {
      console.error('Le numéro de téléphone est invalide. Veuillez entrer un numéro au format (xxx) xxx-xxxx.');
      return;
    }
      // Envoie un POST en JSON
    const response = await fetch('https://enovode7uq1r.x.pipedream.net/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      localStorage.setItem("formData", JSON.stringify(formData));
      console.log('Formulaire soumis', formData);
      const { first_name } = formData;
      navigate(`/merci/${first_name}`);
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
                        value={formData[field.name]}
                        id={field.name}
                        name={field.name}
                        onChange={(event) => handleInputChange(event)}
                      />
                    ) : field.type === 'dropdown' ? (
                      <select
                        type="dropdown"
                        value={formData[field.name]}
                        id={field.name}
                        name={field.name}
                        onChange={(event) => handleInputChange(event)}
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
        <div>
  <h2>Données du formulaire :</h2>
  <pre>{JSON.stringify(formData, null, 2)}</pre>
</div>
      </div>
    );
    
    
  

  
};

export default Inscription;
        