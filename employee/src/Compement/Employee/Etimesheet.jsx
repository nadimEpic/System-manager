import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsCheckCircle } from 'react-icons/bs';

const TimesheetPage = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedTimesheets, setUpdatedTimesheets] = useState([]);
  const [startedTimesheets, setStartedTimesheets] = useState([]);
  const [completedTimesheets, setCompletedTimesheets] = useState([]);

  useEffect(() => {
   
    axios.get('http://localhost:3000/auth/employee/timesheets')
      .then(response => {
        setTimesheets(response.data);
      })
      .catch(error => {
        console.error('Error fetching timesheets:', error.response?.data || error.message);
      });
  }, []);

  const handleDescriptionClick = (timesheet) => {
    setSelectedTimesheet(timesheet);
    setModalShow(true);
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStart = (timesheetId) => {
 
    const startedTimesheetsCopy = [...startedTimesheets, timesheetId];
    setStartedTimesheets(startedTimesheetsCopy);

    const updatedTimesheetsCopy = updatedTimesheets.map(ts => {
      if (ts.id === timesheetId) {
        return { ...ts, etat: 2 }; 
      return ts;
    }
    });
  
    setUpdatedTimesheets(updatedTimesheetsCopy);

    axios.put(`http://localhost:3000/auth/timesheets/${timesheetId}`, { etat: 2 })
      .then(response => {
       
        console.log('Timesheet marked as Start:', timesheetId);
      })
      .catch(error => {
        console.error('Error marking timesheet as Start:', error.response?.data || error.message);
    
        setStartedTimesheets(startedTimesheets.filter(id => id !== timesheetId)); 
        setUpdatedTimesheets(timesheets); 
      });
  };

  const handleComplete = (timesheetId) => {
    
    const completedTimesheetsCopy = [...completedTimesheets, timesheetId];
    setCompletedTimesheets(completedTimesheetsCopy);

    const updatedTimesheetsCopy = updatedTimesheets.map(ts => {
      if (ts.id === timesheetId) {
        return { ...ts, etat: 3 }; 
      }
      return ts;
    });
    setUpdatedTimesheets(updatedTimesheetsCopy);

    // Update backend API
    axios.put(`http://localhost:3000/auth/timesheets/${timesheetId}`, { etat: 3 })
      .then(response => {
       
        console.log('Timesheet marked as Complete:', timesheetId);
      })
      .catch(error => {
        console.error('Error marking timesheet as Complete:', error.response?.data || error.message);
        
        setUpdatedTimesheets(timesheets); 
      });
  };


  const filteredTimesheets = timesheets.filter(
    timesheet => timesheet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Timesheets</h2>
      <Form inline>
        <Row className="align-items-center">
          <Col xs="auto" className="mr-2">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="mr-sm-2"
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimesheets.map(timesheet => (
            <tr key={timesheet.id}>
              <td>{timesheet.date}</td>
              <td>{timesheet.hours}</td>
              <td>
                <Button onClick={() => handleDescriptionClick(timesheet)}>View Description</Button>
              </td>
              <td>
                {!startedTimesheets.includes(timesheet.id) && (
                  <Button variant="success" onClick={() => handleStart(timesheet.id)}>Start</Button>
                )}
                {startedTimesheets.includes(timesheet.id) && !completedTimesheets.includes(timesheet.id) && (
                  <Button variant="primary" onClick={() => handleComplete(timesheet.id)}>Complete</Button>
                )}
                {completedTimesheets.includes(timesheet.id) && (
                  <BsCheckCircle style={{ color: 'green', fontSize: '1.5rem' }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Timesheet Details</Modal.Title>
        </Modal.Header>
        {selectedTimesheet && (
          <Modal.Body>
            <p><strong>Description:</strong> {selectedTimesheet.description}</p>
            <p><strong>Date:</strong> {selectedTimesheet.date}</p>
            <p><strong>Hours:</strong> {selectedTimesheet.hours}</p>
            {!startedTimesheets.includes(selectedTimesheet.id) && (
              <Button variant="success" onClick={() => handleStart(selectedTimesheet.id)}>Start</Button>
            )}
            {startedTimesheets.includes(selectedTimesheet.id) && !completedTimesheets.includes(selectedTimesheet.id) && (
              <Button variant="primary" onClick={() => handleComplete(selectedTimesheet.id)}>Complete</Button>
            )}
            {completedTimesheets.includes(selectedTimesheet.id) && (
              <BsCheckCircle style={{ color: 'green', fontSize: '1.5rem' }} />
            )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimesheetPage;
