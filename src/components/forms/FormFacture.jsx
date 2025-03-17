import { useForm } from "react-hook-form";
import { useEffect, useState, memo } from "react";
import LigneFacture from "./LigneFacture.jsx";
import { Link } from "react-router-dom";
import "./Formfacture.css";

const FormFacture = memo(function FormFacture(props) {
  const [clients, setClients] = useState([]);
  const [estValidee, setEstValidee] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("amaya");
    if (data) {
      setClients(JSON.parse(data).client);
    }
   
    // Vérifier si la facture est validée
    if (props.facture && props.facture.status === 'validée') {
      setEstValidee(true);
    }
  }, [props.facture]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: props.facture.name,
      num: props.facture.num,
      crea: props.facture.crea,
      sent: props.facture.sent,
      charges: props.facture.charges,
    },
  });

  const valider = (data) => {
    // Ne pas permettre la modification si la facture est validée
    if (estValidee) {
      alert("Cette facture est validée et ne peut plus être modifiée");
      return;
    }
    props.traiter(data);
  };

  const validerDefinitivement = () => {
    if (window.confirm("Attention : Une fois validée, cette facture ne pourra plus être modifiée. Voulez-vous valider définitivement cette facture ?")) {
      props.validerDefinitivement && props.validerDefinitivement();
    }
  };

  const creerAvoir = () => {
    if (window.confirm("Voulez-vous créer une facture d'avoir pour cette facture ?")) {
      props.creerAvoir && props.creerAvoir();
    }
  };

  const ajouter = () => {
    if (estValidee) {
      alert("Impossible d'ajouter des lignes à une facture validée");
      return;
    }
    props.ajouter();
  };

  const effacer = (indice) => {
    if (estValidee) {
      alert("Impossible de supprimer des lignes d'une facture validée");
      return;
    }
    props.effacer(indice);
  };

  return (
    <>
      <form onSubmit={handleSubmit(valider)}>
        <div className="text-end">
          {!estValidee ? (
            <>
              <button type="submit" className="btn btn-success my-4 me-2">
                Enregistrer
              </button>
              <button 
                type="button" 
                className="btn btn-primary my-4"
                onClick={validerDefinitivement}
              >
                Valider définitivement
              </button>
            </>
          ) : (
            <>
              <span className="badge bg-success me-2">
                Facture validée {props.facture.dateValidation && new Date(props.facture.dateValidation).toLocaleDateString()}
              </span>
              <button 
                type="button" 
                className="btn btn-warning my-4"
                onClick={creerAvoir}
              >
                Créer une facture d'avoir
              </button>
            </>
          )}
        </div>

        <section className="col-12">
          {/* Afficher une alerte si la facture est validée */}
          {estValidee && (
            <div className="alert alert-info">
              <i className="fas fa-lock me-2"></i>
              Cette facture est validée et verrouillée. Vous ne pouvez plus la modifier.
              {props.facture.factureDavoir && (
                <div className="mt-2">
                  Une facture d'avoir a été créée pour cette facture.
                  <Link to={`/facture-modifier/${props.facture.factureDavoir}`} className="ms-2">
                    Voir la facture d'avoir
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div className="row mt-1">
            <div className="col-12 pt-2 gris">
              <div className="row h80">
                <div className="col-2">
                  <div className="form-floating mb-3">
                    <input
                      {...register("num", {
                        required: "Saisir la référence",
                      })}
                      className={`form-control ${errors.num && 'is-invalid'}`}
                      id="num"
                      disabled={estValidee}
                    />
                    <label htmlFor="num">Référence</label>
                  </div>
                  <span className="text-danger">
                    {errors.num && <p role="alert">{errors.num.message}</p>}
                  </span>
                </div>
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      {...register("name", {
                        required: "Saisir le descriptif",
                      })}
                      className={`form-control ${errors.name && 'is-invalid'}`}
                      id="name"
                      disabled={estValidee}
                    />
                    <label htmlFor="num">Descriptif de la facture (ne s'affiche pas sur la facture)</label>
                  </div>
                  <span className="text-danger">
                    {errors.name && <p role="alert">{errors.name.message}</p>}
                  </span>
                </div>

                <div className="offset-2 col-2">
                  <div className="form-floating">
                    <select
                      className={`form-control ${errors.client && 'is-invalid'}`}
                      {...register("client", {
                        required: "Choisir un client",
                      })}
                      id="client"
                      aria-label="Client"
                      disabled={estValidee}
                    >
                      {clients.map((client) => (
                        <option 
                          key={client.id} 
                          value={client.id} 
                          selected={props.facture.client == client.id ? true : false}
                        > 
                          {client.shortName} 
                        </option>
                      ))}
                    </select>
                    <label htmlFor="client">Client</label>
                  </div>
                  <span className="text-danger">
                    {errors.client && <p role="alert">{errors.client.message}</p>}
                  </span>
                </div>
                
                <div className="text-right pr-5 pt-3 col-2"></div>
              </div>
            </div>
            <div className="col-12 mt-1">
              <div className="row">
                <div className="col-4 pt-2 pb-3 gris2">
                  <div className="form-floating mb-3">
                    <input
                      {...register("crea", {
                        required: "Saisir la date",
                      })}
                      type="date"
                      className={`form-control ${errors.crea && 'is-invalid'}`}
                      id="crea"
                      disabled={estValidee}
                    />
                    <label htmlFor="crea">Création</label>
                  </div>
                  <span className="text-danger">
                    {errors.crea && <p role="alert">{errors.crea.message}</p>}
                  </span>
                </div>

                <div className="col-4 pt-2 gris">
                  <div className="form-floating mb-3">
                    <input
                      {...register("sent")}
                      type="date"
                      className="form-control"
                      id="sent"
                      disabled={estValidee}
                    />
                    <label htmlFor="sent">Envoie</label>
                  </div>
                </div>
                <div className="col-4 pt-2 gris2">
                  <div className="form-floating mb-3">
                    <input
                      {...register("charges")}
                      type="number"
                      className="form-control"
                      id="charges"
                      disabled={estValidee}
                    />
                    <label htmlFor="charges">Charges ou frais</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>

      {props.facture.lignes.map((ligne, indice) => (
        <LigneFacture 
          key={`id ${Math.random().toString(16).slice(2)}`}
          ligne={ligne} 
          indice={indice} 
          effacer={effacer}
          disabled={estValidee} // Passer l'état validé aux composants enfants
        />
      ))}
      
      {!estValidee && (
        <div className="col-12 mt-1 text-center">
          <button onClick={ajouter} className="mt-4 btn btn-success">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      )}

      {/* Affichage de l'historique si la facture est validée */}
      {estValidee && props.facture.historique && props.facture.historique.length > 0 && (
        <div className="mt-4">
          <h5>Historique de la facture</h5>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {props.facture.historique.map((event, index) => (
                <tr key={index}>
                  <td>{new Date(event.date).toLocaleString()}</td>
                  <td>{event.userId}</td>
                  <td>{event.type}</td>
                  <td>{event.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
});

export default FormFacture;