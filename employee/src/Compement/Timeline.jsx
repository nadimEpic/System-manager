import React, { useState, useEffect } from "react";
import { MDBContainer, MDBIcon } from "mdb-react-ui-kit";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/todo.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/auth/evenements', { titre, sous_titre, description });
    fetchEvenements();
    setTitre('');
    setSousTitre('');
    setDescription('');
  };

  return (
    <MDBContainer className="py-5">
      <div className="App">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="titre" className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sous_titre" className="form-label">Sous-titre</label>
            <input
              type="text"
              className="form-control"
              id="sous_titre"
              value={sous_titre}
              onChange={(e) => setSousTitre(e.target.value)}
              placeholder="Sous-titre"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
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
