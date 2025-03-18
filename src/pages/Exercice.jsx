import { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import { setEncryptedItem,getDecryptedItem } from "../utils/encryption.js";
export default function Client() {
  const [amaya, setAmaya] = useState({});
  useEffect(() => {
    const data = getDecryptedItem("amaya");
    if (data) {
      setAmaya(data);
    } else {
      // redirige
    }
  }, []);

  const effacer = (indice) => {
    const nom = amaya.exercice[indice].num;
    const test = confirm(`Voulez-vous effacer  ${nom} ?`);
    if (test) {
      amaya.exercice.splice(indice, 1);
      setAmaya({ ...amaya });
      setEncryptedItem("amaya", amaya);
    }
  };
  return (
    <>
      <Nav active={"exercice"}></Nav>
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
              Liste des exercices
            </li>
          </ol>
        </nav>
        <h1>Exercices</h1>
        <Link to={`/exercice-ajouter`} className="btn btn-success">
          <i className="fa fa-plus"></i>
        </Link>
        <div className="col-6 mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                
                <th> # </th>
                <th> Descriptif </th>
                <th> Année </th>
                <th> Favori </th>
                <th colSpan="2"> Actions </th>
              </tr>
            </thead>
            <tbody>
              {amaya.exercice &&
                amaya.exercice.map((e, indice) => (
                  <tr key={indice}>
                    <td>{e.num}</td>
                    <td>{e.name}</td>
                    <td>{e.year}</td>
                    <td>{e.fav}</td>
                    <td>
                      <Link
                        to={`/exercice-modifier/${e.id}`}
                        className="btn btn-primary"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => effacer(indice)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
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
