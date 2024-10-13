import React, { useState, useEffect } from "react";
import { MDBContainer, MDBIcon } from "mdb-react-ui-kit";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/todo.css';

export default function Timeline() {

  const [evenements, setEvenements] = useState([]);
  const [titre, setTitre] = useState('');
  const [sous_titre, setSousTitre] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchEvenements();
  }, []);

  const fetchEvenements = async () => {
    const res = await axios.get('http://localhost:3000/auth/evenements');
    setEvenements(res.data);
  };

 

  return (
    <MDBContainer className="py-5">
      <div className="App">
       
        <ul className="timeline-with-icons">
          {evenements.map((evenement) => (
            <li className="timeline-item mb-5" key={evenement.id}>
              <span className="timeline-icon">
                <MDBIcon fas icon="rocket" color="primary" size="sm" />
              </span>
              <h5 className="fw-bold">{evenement.titre}</h5>
              <p className="text-muted mb-2 fw-bold">{evenement.sous_titre}</p>
              <p className="text-muted">{evenement.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </MDBContainer>
  );
}
