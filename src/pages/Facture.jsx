import { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import { setEncryptedItem,getDecryptedItem } from "../utils/encryption.js";

export default function Facture() {
  const [amaya, setAmaya] = useState({});
  const [statutFiltre, setStatutFiltre] = useState("tous");
  const [exerciceFiltre, setExerciceFiltre] = useState("");

  useEffect(() => {
    const data = getDecryptedItem("amaya");
    if (data) {
      setAmaya(data);
    } else {
      // redirige
    }
  }, []);

  const effacer = (indice) => {
    // Vérifier si la facture est validée
    if (amaya.facture[indice].status === 'validée') {
      alert("Impossible de supprimer une facture validée");
      return;
    }

    const nom = amaya.facture[indice].num;
    const test = confirm(`Voulez-vous effacer ${nom} ?`);
    if (test) {
      amaya.facture.splice(indice, 1);
      setAmaya({ ...amaya });
      setEncryptedItem("amaya", amaya);
    }
  };

  // Filtrer les factures selon les critères
  const getFacturesFiltrees = () => {
    if (!amaya.facture) return [];
    
    let factures = [...amaya.facture];
    
    // Filtrer par exercice
    if (exerciceFiltre) {
      factures = factures.filter(f => f.exercice === exerciceFiltre);
    }
    
    // Filtrer par statut
    if (statutFiltre === "brouillon") {
      factures = factures.filter(f => !f.status || f.status === 'brouillon');
    } else if (statutFiltre === "validees") {
      factures = factures.filter(f => f.status === 'validée');
    } else if (statutFiltre === "avoir") {
      factures = factures.filter(f => f.factureOriginale);
    }
    
    return factures;
  };

  // Obtenir la classe CSS en fonction du statut
  const getStatusClass = (facture) => {
    if (facture.factureOriginale) return "table-warning"; // Facture d'avoir
    if (facture.status === 'validée') return "table-success";
    return "";
  };

  // Obtenir le nom du client
  const getClientName = (clientId) => {
    if (!amaya.client) return "Client inconnu";
    const client = amaya.client.find(c => c.id == clientId);
    return client ? client.shortName : "Client inconnu";
  };

  return (
    <>
      <Nav active={"facture"}></Nav>
      <div className="ps-5 container bg-light h-600">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb pt-3">
            <li className="breadcrumb-item">
              <Link
                to={`/dashboard`}
                className="link-success"
                href="/backoffice"
              >
                Home
              </Link>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              Liste des factures
            </li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Factures</h1>
          <div>
            <Link to={`/facture-ajouter`} className="btn btn-success">
              <i className="fa fa-plus"></i> Nouvelle facture
            </Link>
          </div>
        </div>

        {/* Filtres */}
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="exercice" className="form-label">Exercice</label>
                <select 
                  id="exercice" 
                  className="form-select"
                  value={exerciceFiltre}
                  onChange={(e) => setExerciceFiltre(e.target.value)}
                >
                  <option value="">Tous les exercices</option>
                  {amaya.exercice && amaya.exercice.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="statut" className="form-label">Statut</label>
                <select 
                  id="statut" 
                  className="form-select"
                  value={statutFiltre}
                  onChange={(e) => setStatutFiltre(e.target.value)}
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="brouillon">Brouillons</option>
                  <option value="validees">Validées</option>
                  <option value="avoir">Factures d'avoir</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="mb-3">
          <span className="badge bg-success me-2">Facture validée</span>
          <span className="badge bg-warning text-dark me-2">Facture d'avoir</span>
        </div>

        <div className="col-12 mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th> # </th>
                <th> Référence </th>
                <th> Descriptif </th>
                <th> Client </th>
                <th> Date </th>
                <th> Statut </th>
                <th colSpan="3"> Actions </th>
              </tr>
            </thead>
            <tbody>
              {amaya.facture &&
                getFacturesFiltrees().map((e, indice) => (
                  <tr key={indice} className={getStatusClass(e)}>
                    <td>{indice + 1}</td>
                    <td>{e.num}</td>
                    <td>{e.name}</td>
                    <td>{getClientName(e.client)}</td>
                    <td>{e.crea}</td>
                    <td>
                      {e.factureOriginale ? (
                        <span className="badge bg-warning text-dark">Avoir</span>
                      ) : e.status === 'validée' ? (
                        <span className="badge bg-success">Validée</span>
                      ) : (
                        <span className="badge bg-secondary">Brouillon</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/facture-modifier/${e.id}`}
                        className="btn btn-primary"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>
                    <td>
                      {/* Bouton pour visualiser le PDF */}
                      <Link
                        to={`/facture-pdf/${e.id}`}
                        className="btn btn-info"
                      >
                        <i className="fa fa-file-pdf"></i>
                      </Link>
                    </td>
                    <td>
                      {(!e.status || e.status !== 'validée') && (
                        <button
                          className="btn btn-danger"
                          onClick={() => effacer(indice)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}