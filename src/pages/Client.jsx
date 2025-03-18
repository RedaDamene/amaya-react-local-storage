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
      //console.log(JSON.parse(data));
    } else {
      // redirige
    }
  }, []);

  const effacer = (indice) => {
    const nom = amaya.client[indice].company;
    const test = confirm(`Voulez-vous effacer ${nom} ?`);
    if (test) {
      amaya.client.splice(indice, 1);
      setAmaya({ ...amaya });
      setEncryptedItem("amaya", amaya);
    }
  };
  return (
    <>
      <Nav active={"client"}></Nav>
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
              Liste des clients
            </li>
          </ol>
        </nav>
        <h1>Clients</h1>
        <Link to={`/client-ajouter`} className="btn btn-success">
          <i className="fa fa-plus"></i>
        </Link>
        <div className="col-6 mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th> # </th>
                <th> Company </th>
                <th> Contact </th>
                <th colSpan="2"> Actions </th>
              </tr>
            </thead>
            <tbody>
              {amaya.client &&
                amaya.client.map((client, indice) => (
                  <tr key={indice}>
                    <td>{indice + 1}</td>
                    <td>{client.company}</td>
                    <td>{client.name}</td>
                    <td>
                      <Link
                        to={`/client-modifier/${client.id}`}
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
