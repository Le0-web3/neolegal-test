CSS

@import "../../node_modules/bootstrap/scss/bootstrap.scss";
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');


/* Modifier les couleurs principales */
$primary: #1BA098;
$secondary: #051622;
$tertiary: #DEB992;
$black: #000000;

#root {
  margin: 0;
  padding: 0;
  font-family: 'Lato', sans-serif;
}

.question-font {
  color: darken($tertiary, 30%);
  margin-top: 4%;
  margin-bottom: 2%;
  font-size: 3em;
}

.form-label {
  color: $tertiary;
}

.form-group label {
  font-weight: bold;
}

.form-control {
  border-color: $secondary;
}

.btn-primary {
  background-color: $primary;
  border-color: $primary;
  color: $secondary;
  margin-top: 5em;
}

.btn-primary:hover {
  background-color: darken($primary, 10%);
  border-color: darken($primary, 10%);
}

.my-bg-inscription {
  --bs-bg-opacity: 1;
  background-image: linear-gradient(to bottom right, $black, $secondary);
  padding: 5%;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Masquer la barre de défilement */
}

.my-bg-merci {
  --bs-bg-opacity: 1;
  background-image: linear-gradient(to bottom right, lighten($primary, 60%), lighten($tertiary, 20%));
  padding: 5%;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Masquer la barre de défilement */
}

.form {
  padding-top: 2vh;
  padding-left: 10%;
  padding-right: 10%;
}

.my-message {
  color: darken($secondary, 30%);
}

.my-variable {
  color: lighten($secondary, 10%);
}

/* Media query pour les mobiles */
@media (max-width: 767px) {

  .my-bg-inscription {
    height: 100%;
    width: 100%;
    padding: 3%;
  }

  .my-bg-merci {
    height: 100%;
    width: 100%;
    padding: 3%;
  }


  .form {
    padding-top: 0;
    padding-left: 5%;
    padding-right: 5%;
  }

  .form-label {
    margin-bottom: 1%;
  }

  .btn-primary {
    margin-top: 0;
  }

  .question-font {
    margin-top: 2%;
    font-size: 1.5em;
  }

  .my-message{
    font-size: 1.5em;
  }
}



MERCI

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
    setInputValue(newValue);
    }

    return (
      <div className="my-bg-merci vh-100 vw-100 d-flex align-items-center justify-content-center">
    
          <div className="col-md-8 text-center">
          <h1 className="my-message my-4">Merci<br /><span className="my-variable">{inputValue || name}</span><br />pour votre inscription</h1>
            <input
              type="text"
              className="form-control mt-3"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </div>

      </div>
    );

};

export default Merci;


INSCRIPTION
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import InputMask from 'react-text-mask';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import './styles.scss';

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
    // Vérification du format du prénom avant POST
    const firstNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[- ][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    const isValidFirstName = firstNameRegex.test(formData.first_name) && formData.first_name.length <= 128;
    if (!isValidFirstName) {
      console.error('Le prénom est invalide. Veuillez entrer un prénom valide.');
      alert('Le prénom est invalide. Veuillez entrer un prénom valide.');
      return;
} 

    // Vérification du format du nom avant POST
    const lastNameRegex = /^[A-ZÀ-Ö]+(?:[- ][A-ZÀ-Ö]+)*$/;
    const isValidLastName = lastNameRegex.test(formData.last_name) && formData.last_name.length <= 128;
    if (!isValidLastName) {
      console.error('Le nom est invalide. Veuillez entrer un nom valide.');
      alert('Le nom est invalide. Veuillez entrer un nom valide.');
      return;
    }

    // Vérification du format de l'email avant POST
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    const isValidEmail = emailRegex.test(formData.email) && formData.email.length <= 128;
    if (!isValidEmail) {
      console.error("L'email est invalide. Veuillez entrer un email valide.");
      alert("L'email est invalide. Veuillez entrer un email valide.");
      return;
    }

    // Vérification du format du numéro de téléphone avant POST
    const phoneNumberRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const isValidPhoneNumber = phoneNumberRegex.test(formData.phone_number);
    if (!isValidPhoneNumber) {
      console.error('Le numéro de téléphone est invalide. Veuillez entrer un numéro au format (xxx) xxx-xxxx.');
      alert('Le numéro de téléphone est invalide. Veuillez entrer un numéro au format (xxx) xxx-xxxx.');
      return;
    }

    // Vérification du format de l'adresse avant POST
    const addresslRegex = /^[a-z0-9À-ö]+(?:[-' ][a-z0-9À-ö]+)*$/i;
    const isValidAddress = addresslRegex.test(formData.street_address) && formData.street_address.length <= 128;
    if (!isValidAddress) {
      console.error("L'adresse est invalide. Veuillez entrer une adresse valide.");
      alert("L'adresse est invalide. Veuillez entrer une adresse valide.");
      return;
    }

    // Vérification du format du code postal avant POST
    const postcodeRegex = /^[A-Z0-9 ]{1,8}$/;
    const isValidPostcode = postcodeRegex.test(formData.post_code)
    if (!isValidPostcode) {
      console.error("Le code postal est invalide. Veuillez entrer un code postal valide.");
      alert("Le code postal est invalide. Veuillez entrer un code postal valide.");
      return;
    }

    // Vérification du format du pays avant POST
    const countryRegex = /^[A-ZÀ-Ö]+(?:[- ][A-ZÀ-Ö]+)*$/;
    const isValidCountry = countryRegex.test(formData.country)
    if (!isValidCountry) {
      console.error("Le pays est invalide. Veuillez entrer un pays valide.");
      alert("Le pays est invalide. Veuillez entrer un pays valide.");
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
    <div className="my-bg-inscription">
      <div className="form">
        {formJson && formJson.questions ? (
          <Form onSubmit={handleSubmit}>
            {formJson.questions.map((question, index) => (
              <div key={index} className="row">
                <div className="col-sm-12">
                  <h3 className="question-font">{question.title}</h3>
                </div>
                {question.fields.map((field, index) => (
                  <div key={index} className="col-sm-6">
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                      {field.type === 'text' ? (
                        masks[field.name] ? (
                          <FormControl
                            type="text"
                            as={InputMask}
                            mask={masks[field.name]}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(event) => handleInputChange(event)}
                            className="form-control"
                          />
                        ) : (
                          <FormControl
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(event) => handleInputChange(event)}
                            className="form-control"
                          />
                        )
                      ) : field.type === 'dropdown' ? (
                        <FormControl
                          as="select"
                          id={field.name}
                          name={field.name}
                          onChange={(event) => handleInputChange(event)}
                          className="form-select"
                        >
                          {field.options.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </FormControl>
                      ) : null}
                    </FormGroup>
                  </div>
                ))}
              </div>
            ))}
            <Button type="submit" className="btn btn-primary">Enregistrer</Button>
          </Form>
        ) : null}
      </div>
    </div>
  );
  
  
    
    
  

  
};

export default Inscription;

