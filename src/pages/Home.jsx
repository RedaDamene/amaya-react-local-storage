import { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { getDecryptedItem, setEncryptedItem } from "../utils/encryption.js"; // Importe les fonctions de chiffrement

export default function Login() {
  const [amaya, setAmaya] = useState({});
  
  useEffect(() => {
    // Utilise getDecryptedItem au lieu de localStorage.getItem directement
    const data = getDecryptedItem("amaya");
    
    if (data) {
      setAmaya(data); // Plus besoin de JSON.parse car getDecryptedItem le fait déjà
    } else {
      // Exercice 2024  Du 01 Juillet 2024 au 30 Juin 2025
      const obj = {
        entreprise:{
          name : 'Amaya Tech SAS',
          address1: '6 rue de la poste',
          address2 : '44100 Nantes',
          country :'FRANCE',
          email: 'hello@amaya-tech.fr',
          www: 'www.amaya-tech.fr',
          tel: '06 01 02 03 04'
        },
        currentExercie:1,
        client: [
          {
            company: "Amazon",
            shortName: "Amazon",
            name: "jean-Pierre MORINO",
            tel:'06 88 88 88 77',
            email:'jeff@amazon.fr',
            address1:'36 rue de la Poste',
            address2:'44840 LES SORINIERES',
            country:'FRANCE',
            id: 1,
          },
          {
            company: "Microsoft",
            shortName: "Microsoft",
            name: "jean-Luc FRANCE",
            id: 2,
          },
          {
            company: "Apple Store",
            shortName: "Apple",
            name: "Jean-Louis AUBERT",
            id: 3,
          },
        ],
        facture: [],
        exercice: [
          {
            name: "Du 01 Juillet 2024 au 30 Juin 2025",
            num: "01",
            year: "2024",
            fav: 1,
            id: 1,
          },
        ],
        devis: [],
      };
      
      // Utilise setEncryptedItem au lieu de localStorage.setItem
      setEncryptedItem("amaya", obj);
      setAmaya(obj);
    }
  }, []);
  
  return (
    <>
      <Nav active={"home"}></Nav>
      <div className="container bg-light ps-4">
        <h1 className="mt-5">Dashboard</h1>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi veniam
        debitis ratione sit, libero, iste voluptatem numquam nam quisquam natus
        voluptas, cumque voluptatum hic eveniet sapiente dolor accusamus aperiam
        tenetur.
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />{" "}
        <br /> <br /> <br /> <br /> <br />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />{" "}
        <br /> <br />
      </div>
      <Footer></Footer>
    </>
  );
}