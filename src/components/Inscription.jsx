import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import InputMask from 'react-text-mask';

const Inscription = () => {
  const navigate = useNavigate();   // Router
  const [formJson, setFormJson] = useState({}); // stocke le JSON retourné par la requete
  const [formData, setFormData] = useState({
    country: "CA",
  });   // stocke les inputs. J initialise country car j en ai besoin pour le formattage du postcode.

  //   -----   INPUT MASK  -----
  // Je voulais l'utiliser pour tout, mais il faut un nombre de caracteres définis. Pour les autres champs, je formate avec formatInput().
  const masks = {
    phone_number: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    post_code: maskForPostCode(),
  }

  function maskForPostCode() {
    let mask = [];
    if(formData.country === "CA") {
      mask = [/[a-zA-Z]/, /\d/, /[a-zA-Z]/, ' ', /\d/, /[a-zA-Z]/, /\d/];
    }
    else {
      mask = [/[a-zA-Z]/, /[a-zA-Z]/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/];
    }
    return mask;

  }

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
  // Mes inputs sont controlés par le state formData. J'impose un format à la saisie et je stocke dans formData

  function formatInput(name, value) {
    let formattedInput = "";
    if(name === "first_name") {
      // on enleve les chiffres et ne garder que les lettres (dont celles avec accents), les traits d'union et les espaces
      const cleanedStr = value.replace(/[^A-Za-zÀ-ÿ -]/g, '');
      // on ne laisse pas plus de 1 espace ou trait d'union d'affilée
      const singleSpacesAndHyphensStr = cleanedStr.replace(/( |-)( |-)/g, '$1');
      // on passe tout en minuscule
      const lowercaseFormattedStr = singleSpacesAndHyphensStr.toLowerCase();
      // on passe la première lettre (et chaque première lettre après un trait d'union ou un espace) en majuscule
      formattedInput = lowercaseFormattedStr.replace(/\b\w/g, (match) => match.toUpperCase());
    }
    else if(name === "last_name") {
      // on enlève les chiffres et ne garder que les lettres (dont celles avec accents), les traits d'union, les espaces et les apostrophes
      const cleanedStr = value.replace(/[^A-Za-zÀ-ÿ '-]/g, '');
      // on ne laisse pas plus de 1 espace ou trait d'union d'affilée
      const singleSpacesAndHyphensStr = cleanedStr.replace(/( |-)( |-)/g, '$1');
      // on ne laisse pas plus de 1 apostrophe d'affilée
      const singleApostropheStr = singleSpacesAndHyphensStr.replace(/(')(')/g, '$1');
      // on passe tout en majuscule
      formattedInput = singleApostropheStr.toUpperCase();
    }
    else if(name === "email") {
      // on enlève les accents, cédilles, caractères accentués et espaces
      const cleanedStr = value.replace(/[À-ÿÇç\s]/g, '');
      // on ne garde qu'un seul @ et on interdit les autres
      const singleAtStr = cleanedStr.replace(/@/g, (match, offset) => (offset === cleanedStr.indexOf('@') ? match : ''));
      // on passe tout en minuscule
      formattedInput = singleAtStr.toLowerCase();
    }
    // je n'ai pas d'idée de format à imposer à street_address
    else if(name === "post_code") {
      // on passe tout en majuscule
      formattedInput = value.toUpperCase();
    }


    
    else {
      formattedInput = value;
    }

    return formattedInput;
  }

  // Gère les changements de valeur des champs et formate
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newValue = formatInput(name, value);
      setFormData({
        ...formData,
        [name]: newValue
      });
    }



  //   -----   OUTPUTS   -----
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Vérification du format du numéro de téléphone avant POST
    const phoneNumberRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
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
                    masks[field.name] ? (
                      <InputMask
                        type="text"
                        mask={masks[field.name]}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={(event) => handleInputChange(event)}
                      />
                    ) : (
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={(event) => handleInputChange(event)}
                      />
                    )
                  ) : field.type === 'dropdown' ? (
                    <select
                      type="dropdown"
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
