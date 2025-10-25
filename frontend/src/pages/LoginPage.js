import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
        window.location.reload(); // Reload to update Navbar state
      }
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.detail) || error.message || error.toString();
      setMessage(resMessage);
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Form>
          {message && (
            <Alert variant="danger" className="mt-3">
              {message}
            </Alert>
          )}
          <div className="w-100 text-center mt-2">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
