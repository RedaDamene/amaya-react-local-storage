import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Facture from "../models/Facture"

import { setEncryptedItem,getDecryptedItem } from "../utils/encryption";
export default function FactureAjouter() {
  const navigate = useNavigate();
  useEffect(() => {
    const data = getDecryptedItem("amaya");
    if (data) {
      const amaya = data
      const facture = new Facture(amaya.currentExercice)
      amaya.facture.push(facture)
      setEncryptedItem("amaya",amaya)
      
      navigate(`/facture-modifier/${facture.id}`);
    } else {
      // redirige
    }
  }, []);
  


return (
    <>
      
    </>
  );
}
