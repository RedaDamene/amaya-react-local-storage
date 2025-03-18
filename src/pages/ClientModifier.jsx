import { useEffect, useState } from 'react';
import Nav  from "../components/Nav.jsx";
import Footer  from "../components/Footer.jsx";
import FormClient  from "../components/forms/FormClient.jsx";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from 'react-router-dom'
import { setEncryptedItem,getDecryptedItem } from '../utils/encryption.js';
export default function ClientModifier() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [client, setClient] = useState({});
  const [amaya, setAmaya] = useState({});
  useEffect(() => {
      const data = getDecryptedItem('amaya');
      if(data){
      const amaya2=data;
      setAmaya(amaya2);
      const obj =amaya2.client.find(c => c.id == id)
      //console.log(obj);
      setClient(obj);
      }else{
        // redirige
      }
    },[])
    
  const traiter =(data)=>{
    const clientM = {...data,id:id}
    const indice =amaya.client.findIndex(c => c.id == id);
    amaya.client[indice] =clientM 
    setEncryptedItem('amaya',amaya);
    setAmaya({...amaya});
    navigate("/client");
  }
  return (
    <>
     <Nav active={'client'}></Nav>
     <div className="ps-5 container bg-light">
     <nav aria-label="breadcrumb">
          <ol className="breadcrumb pt-3">
            <li className="breadcrumb-item">
            <Link
                  to={`/dashboard`} className="link-success" >Home</Link>
            </li>
            <li className="breadcrumb-item">
            <Link
                  to={`/client`} className="link-success" >Liste des clients</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Ajouter un client</li>
          </ol>
        </nav>

      <h1 className="py-2">Modifier un client</h1>
    

 { 

 client.id &&

     <FormClient traiter={traiter} client={client}/>
 }
       
      </div>
     <Footer></Footer>
    </>
  )
}
