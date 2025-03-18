import { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import FormFacture from "../components/forms/FormFacture";
import Facture from "../models/Facture";
import Ligne from "../models/Ligne";
import { setEncryptedItem,getDecryptedItem } from "../utils/encryption.js";

export default function FactureModifier() {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);
  const [amaya, setAmaya] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = getDecryptedItem("amaya");
    if (data) {
      setAmaya(data);
      const parsed = data;
      const facture = parsed.facture.find((e) => e.id == id);
      
      // Recréer une instance de Facture avec les méthodes
      if (facture) {
        const factureInstance = new Facture(facture.exercice);
        Object.assign(factureInstance, facture);
        
        // S'assurer que les lignes sont des instances de Ligne
        if (factureInstance.lignes && factureInstance.lignes.length > 0) {
          factureInstance.lignes = factureInstance.lignes.map(ligneData => {
            const ligne = new Ligne();
            Object.assign(ligne, ligneData);
            return ligne;
          });
        }
        
        // Initialiser l'historique si nécessaire
        if (!factureInstance.historique) {
          factureInstance.historique = [];
        }
        
        setFacture(factureInstance);
      }
    } else {
      alert("Pas de données dans localStorage");
    }
  }, [id]);

  useEffect(() => {
    if (amaya?.facture && facture) {
      const index = amaya.facture.findIndex((e) => e.id == id);
      if (index !== -1) {
        amaya.facture[index] = facture;
        setEncryptedItem("amaya", amaya);
      }
    }
  }, [facture]);

  const traiter = (data) => {
    // Vérifier si la facture est validée
    if (facture.status === 'validée') {
      alert("Cette facture est validée et ne peut plus être modifiée");
      return;
    }
    
    setFacture({ ...facture, ...data });
    alert("Facture mise à jour");
  };

  // Validation définitive de la facture avec signature
  const validerDefinitivement = (validationData) => {
    try {
      console.log(validationData)
      // S'assurer que tous les champs nécessaires sont remplis
      /*if (!facture.client || !facture.num || !facture.crea) {
        alert("Veuillez remplir tous les champs obligatoires avant de valider la facture");
        return;
      }*/
      
      // Calculer le total HT
      let totalHT = 0;
      facture.lignes.forEach(ligne => {
        const prix = parseFloat(ligne.prix || 0);
        const qt = parseFloat(ligne.qt || 0);
        totalHT += prix * qt;
      });
      
      // Ajouter les charges
      if (facture.charges) {
        totalHT += parseFloat(facture.charges);
      }
      
      // Mettre à jour le total
      facture.ht = Math.round(totalHT * 100) / 100;
      
      // Valider la facture avec les données de signature
      facture.valider(validationData);
      
      setFacture({ ...facture });
      alert("Facture validée avec succès. Elle ne peut plus être modifiée.");
    } catch (error) {
      alert(`Erreur lors de la validation: ${error.message}`);
    }
  };

  // Créer une facture d'avoir
  const creerAvoir = () => {
    try {
      // Vérifier que la facture est validée
      if (facture.status !== 'validée') {
        alert("Seules les factures validées peuvent avoir une facture d'avoir");
        return;
      }
      
      // Créer la facture d'avoir
      const avoir = facture.creerFactureDavoir(facture.signataireName || 'admin');
      
      // Ajouter la facture d'avoir à la liste
      amaya.facture.push(avoir);
      
      // Mettre à jour la facture originale avec la référence à l'avoir
      const index = amaya.facture.findIndex(f => f.id == facture.id);
      if (index !== -1) {
        amaya.facture[index] = facture;
      }
      
      // Sauvegarder dans localStorage
      setEncryptedItem("amaya",amaya);
      
      // Rediriger vers la facture d'avoir
      alert("Facture d'avoir créée avec succès");
      navigate(`/facture-modifier/${avoir.id}`);
    } catch (error) {
      alert(`Erreur lors de la création de l'avoir: ${error.message}`);
    }
  };

  const ajouter = () => {
    // Vérifier si la facture est validée
    if (facture.status === 'validée') {
      alert("Impossible d'ajouter des lignes à une facture validée");
      return;
    }
    
    const l = new Ligne();
    const lignes = [...facture.lignes, l];
    setFacture({ ...facture, lignes });
  };

  const effacer = (indice) => {
    // Vérifier si la facture est validée
    if (facture.status === 'validée') {
      alert("Impossible de supprimer des lignes d'une facture validée");
      return;
    }
    
    const lignes = [...facture.lignes];
    lignes.splice(indice, 1);
    setFacture({ ...facture, lignes });
  };

  return (
    <>
      <Nav active={"facture"}></Nav>
      <div className="ps-5 container bg-light ">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb pt-3">
            <li className="breadcrumb-item">
              <Link to={`/dashboard`} className="link-success">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/facture`} className="link-success">
                Factures
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {facture && facture.num 
                ? `Facture ${facture.num} ${facture.status === 'validée' ? '(Validée)' : ''}` 
                : "Facture"}
            </li>
          </ol>
        </nav>
        {facture && (
          <FormFacture
            facture={facture}
            traiter={traiter}
            ajouter={ajouter}
            effacer={effacer}
            validerDefinitivement={validerDefinitivement}
            creerAvoir={creerAvoir}
          />
        )}
      </div>
      <Footer></Footer>
    </>
  );
}