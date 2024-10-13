import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BiUserPlus } from 'react-icons/bi';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const TimesheetPage = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [category, setCategory] = useState([]);
  const [etat, setEtat] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState(null);

  useEffect(() => {
   
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios.get('http://localhost:3000/auth/etat')
      .then(result => {
        if (result.data.Status) {
          setEtat(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    // Fetch timesheets
    axios.get('http://localhost:3000/auth/timesheets')
      .then(response => {
        setTimesheets(response.data);
      })
      .catch(error => {
        console.error('Error fetching timesheets:', error.response?.data || error.message);
      });
  }, []);

  const getCategoryName = (id) => {
    const categoryItem = category.find((cat) => cat.id === id);
    return categoryItem ? categoryItem.name : "Unknown Category";
  };

  const getEtatName = (id) => {
    const etatItem = etat.find((et) => et.id === id);
    return etatItem ? etatItem.state_name : "Unknown";
  };

  const getEtatColor = (id) => {
    const etatItem = etat.find((et) => et.id === id);
    if (etatItem) {
      switch (etatItem.state_name) {
        case 'start':
          return 'green';
        case 'en cours':
          return 'orange';
        case 'complete':
          return 'red';
        default:
          return 'black';
      }
    }
    return 'black';
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const timesheetsF = timesheets.filter(
    (timesheet) =>
      (selectedCategory === "All" || timesheet.category_id === selectedCategory) &&
      timesheet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
    setModalShow(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (timesheet) => {
    setTimesheetToDelete(timesheet);
    setDeleteModalShow(true);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`http://localhost:3000/auth/timesheets/${timesheetToDelete.id}`)
      .then(response => {
        if (response.data.Status) {
          setTimesheets(timesheets.filter(timesheet => timesheet.id !== timesheetToDelete.id));
        } else {
          alert(response.data.Error);
        }
        setDeleteModalShow(false);
        setTimesheetToDelete(null);
      })
      .catch(error => {
        console.error('Error deleting timesheet:', error.response?.data || error.message);
        setDeleteModalShow(false);
        setTimesheetToDelete(null);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Timesheets</h2>
      <Form inline>
        <Row className="align-items-center">
          <Col xs="auto" className="mr-4">
            <Link to="/dashboard/add_timesheet" className="btn btn-success">
              <BiUserPlus /> Add Timesheet
            </Link>
          </Col>
          <Col xs="auto" className="mr-2">
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              onChange={handleSearch}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Hours</th>
            <th>Description</th>
            <th>Category</th>
            <th>Status</th>
            <th>
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedCategory === "All" ? "All" : getCategoryName(selectedCategory)}
              >
                <Dropdown.Item onClick={() => handleCategoryChange("All")}>All</Dropdown.Item>
                {category.map((cat) => (
                  <Dropdown.Item key={cat.id} onClick={() => handleCategoryChange(cat.id)}>
                    {cat.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {timesheetsF.map(timesheet => (
            <tr key={timesheet.id} style={{ color: getEtatColor(getEtatName(timesheet.etat_id)) }}>
              <td>{timesheet.date}</td>
              <td>{timesheet.hours}</td>
              <td>
                <Button onClick={() => handleDescriptionClick(timesheet.description)}>View Description</Button>
              </td>
              <td>{getCategoryName(timesheet.category_id)}</td>
              <td>{getEtatName(timesheet.etat_id)}</td>
              <td>
                {timesheet.etat_id === 3 && (
                  <Button variant="danger" onClick={() => handleDeleteClick(timesheet)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

   
      <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this timesheet?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimesheetPage;
