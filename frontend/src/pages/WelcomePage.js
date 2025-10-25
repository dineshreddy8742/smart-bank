import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center text-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '30rem', padding: '2rem' }}>
        <Card.Body>
          <h1 className="mb-4">Welcome to Smart Bank!</h1>
          <p className="lead mb-4">
            Your secure and modular banking solution.
          </p>
          <Button variant="primary" as={Link} to="/login" size="lg">
            Get Started
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WelcomePage;
