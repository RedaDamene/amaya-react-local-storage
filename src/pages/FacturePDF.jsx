import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myFacturePdf } from "../components/pdf/myFacturePdf";
import { getDecryptedItem } from "../utils/encryption";

export default function FacturePdf() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getDecryptedItem("amaya");
    if (data) {
      const amaya = data;
      const facture = amaya.facture.find((f) => f.id == id);

      if (facture) {
        // Récupérer le client associé à la facture
        const client = amaya.client.find((client)=>client.id==facture.client)
        
        if (client) {
          // Générer et ouvrir directement le PDF
          myFacturePdf(facture, client);
          
          // Rediriger vers la liste des factures après un court délai
          // pour éviter que la page reste vide
          setTimeout(() => {
            navigate("/facture");
          }, 500);
        } else {
          alert("Client introuvable");
          navigate("/facture");
        }
      } else {
        alert("Facture introuvable");
        navigate("/facture");
      }
    } else {
      alert("Données introuvables");
      navigate("/facture");
    }
  }, [id, navigate]);

  // Cette page ne sera visible que brièvement avant la redirection
  return (
    <div className="container text-center p-5">
      <h2>Génération du PDF en cours...</h2>
      <div className="spinner-border mt-3" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
}