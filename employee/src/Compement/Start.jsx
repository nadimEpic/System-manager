import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';
import '../style/start.css';
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
     
      <header className="App-header">
        <div className="blur-background"></div>
        <Container className="h-100">
          <Row className="h-100 align-items-center">
            <Col md={6}>
              <h1 className='hh'>  
      <span>H</span>E<span>LLO</span>
    </h1>
              <p>
                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was.
              </p>
              <Link to='/adminlogin'>
              <Button variant="outline-light">Get Stared</Button>
              </Link>
             
            </Col>
                   </Row>
        </Container>
      </header>
      <div className="pagination">
        <span>Nadim</span>
      </div>
    </div>
  );
}

export default App;
