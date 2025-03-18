import { useEffect, useState } from 'react';
import Nav  from "../components/Nav.jsx";
import Footer  from "../components/Footer.jsx";
import FormExercice  from "../components/forms/FormExercice.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { setEncryptedItem,getDecryptedItem } from '../utils/encryption.js';
export default function ExerciceAjouter() {
  const [amaya,setAmaya] = useState({});  
  useEffect(() => {
      const data = getDecryptedItem('amaya');
      if(data){
        setAmaya(data);
      }else{
        // redirige
      }
    },[])
    const navigate = useNavigate();

  const traiter =(data)=>{
    const exercice = {...data,id:new Date().getTime()}
    console.log(exercice);
    console.log(amaya);
    amaya.exercice.push(exercice);
    setEncryptedItem('amaya', amaya);
    setAmaya({...amaya});
    navigate("/exercice");
  }
  const exercice ={
    name:'',
    num:'',
    tel:'',
    fav:''
  }
  return (
    <>
     <Nav active={'exercice'}></Nav>
     <div className="ps-5 container bg-light">
     <nav aria-label="breadcrumb">
          <ol className="breadcrumb pt-3">
            <li className="breadcrumb-item">
            <Link
                  to={`/dashboard`} className="link-success" >Home</Link>
            </li>
            <li className="breadcrumb-item">
            <Link
                  to={`/exercice`} className="link-success" >Liste des exercices</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Ajouter un client</li>
          </ol>
        </nav>

      <h1 className="py-2">Ajouter un exercice</h1>
     <FormExercice traiter={traiter} exercice={exercice} />
     
       
      </div>
     <Footer></Footer>
    </>
  )
}
