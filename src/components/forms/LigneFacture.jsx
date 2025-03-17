import { useState } from "react";

export default function LigneFacture(props) {
  const [ligne, setLigne] = useState(props.ligne);
  
  // Récupérer l'état de validation depuis les props
  const estDesactive = props.disabled || false;

  const majligne1 = (e) => {
    if (estDesactive) return; // Ne pas modifier si désactivé
    
    setLigne({ ...ligne, ligne1: e.target.value });
    props.ligne.ligne1 = e.target.value;
  };

  const majligne2 = (e) => {
    if (estDesactive) return;
    
    setLigne({ ...ligne, ligne2: e.target.value });
    props.ligne.ligne2 = e.target.value;
  };

  const majligne3 = (e) => {
    if (estDesactive) return;
    
    setLigne({ ...ligne, ligne3: e.target.value });
    props.ligne.ligne3 = e.target.value;
  };

  const majprix = (e) => {
    if (estDesactive) return;
    
    setLigne({ ...ligne, prix: e.target.value });
    props.ligne.prix = e.target.value;

    // Recalcul du total
    let prix = e.target.value;
    let qt = ligne.qt || 0;
    let total = (parseFloat(prix || 0) * parseFloat(qt)).toFixed(2);
    props.ligne.total = total;
  };

  const majqt = (e) => {
    if (estDesactive) return;
    
    setLigne({ ...ligne, qt: e.target.value });
    props.ligne.qt = e.target.value;

    // Recalcul du total
    let prix = ligne.prix || 0;
    let qt = e.target.value;
    let total = (parseFloat(prix) * parseFloat(qt || 0)).toFixed(2);
    props.ligne.total = total;
  };

  const effacer = () => {
    if (estDesactive) {
      alert("Impossible de supprimer une ligne d'une facture validée");
      return;
    }
    props.effacer(props.indice);
  };

  return (
    <div className="container gris">
      <div className="row">
        <div className="col-5">
          <div className="row">
            <div className="col-12 pt-2 designations">
              <div className="form-floating mb-1">
                <input
                  onChange={majligne1}
                  value={ligne.ligne1 || ""}
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="ligne 1"
                  disabled={estDesactive}
                />
                <label htmlFor="floatingInput">Ligne 1</label>
              </div>
              <div className="form-floating mb-1">
                <input
                  onChange={majligne2}
                  value={ligne.ligne2 || ""}
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="ligne 2"
                  disabled={estDesactive}
                />
                <label htmlFor="floatingInput">Ligne 2</label>
              </div>
              <div className="form-floating mb-1">
                <input
                  onChange={majligne3}
                  value={ligne.ligne3 || ""}
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="ligne 3"
                  disabled={estDesactive}
                />
                <label htmlFor="floatingInput">Ligne 3</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-7 tarifs">
          <div className="row mt-2">
            <div className="col-2 mt-4">
              <div className="form-floating mb-3">
                <input
                  onChange={majqt}
                  value={ligne.qt || ""}
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="qt"
                  disabled={estDesactive}
                />
                <label htmlFor="floatingInput">Quantité</label>
              </div>
            </div>
            <div className="col-2 mt-4">
              <div className="form-floating mb-3">
                <input
                  onChange={majprix}
                  value={ligne.prix || ""}
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="prix"
                  disabled={estDesactive}
                />
                <label htmlFor="floatingInput">Prix</label>
              </div>
            </div>
            <div className="col-3 mt-4">
              <div className="form-floating mb-3">
                <input
                  value={(parseFloat(ligne.prix || 0) * parseFloat(ligne.qt || 0)).toFixed(2)}
                  type="text"
                  className="form-control bg-light"
                  id="floatingInput"
                  placeholder="total"
                  readOnly
                />
                <label htmlFor="floatingInput">Total</label>
              </div>
            </div>
            <div className="col-1 offset-3 mt-5">
              {!estDesactive && (
                <button onClick={effacer} className="btn btn-danger">
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}