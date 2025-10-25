import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Row, Col, Table, Spinner, Badge, Modal } from 'react-bootstrap';
import authService from '../services/auth.service';
import accountService from '../services/account.service';

const DashboardPage = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState('savings');
  const [initialDeposit, setInitialDeposit] = useState(500);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  // State for money transfer
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferMessage, setTransferMessage] = useState('');
  const [transferSuccessful, setTransferSuccessful] = useState(false);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const [transferMoneyLoading, setTransferMoneyLoading] = useState(false);

  // State for delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAccounts = () => {
    accountService.getAccounts().then(
      (response) => {
        setAccounts(response.data);
      },
      (error) => {
        const _content = (error.response && error.response.data && error.response.data.detail) 
          ? (typeof error.response.data.detail === 'object' ? JSON.stringify(error.response.data.detail) : error.response.data.detail)
          : error.message || error.toString();
        setAccounts([]);
        setMessage(_content);
      }
    );
  };

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      fetchAccounts();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    setCreateAccountLoading(true);

    try {
      await accountService.createAccount(accountType.toLowerCase(), initialDeposit);
      setMessage('Account created successfully!');
      setSuccessful(true);
      fetchAccounts();
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.detail) 
        ? (typeof error.response.data.detail === 'object' ? JSON.stringify(error.response.data.detail) : error.response.data.detail)
        : error.message || error.toString();
      setMessage(resMessage);
      setSuccessful(false);
    } finally {
      setCreateAccountLoading(false);
    }
  };

  const handleTransferMoney = async (e) => {
    e.preventDefault();
    setTransferMessage('');
    setTransferSuccessful(false);
    setTransferMoneyLoading(true);

    if (!fromAccountId) {
      setTransferMessage('Please select an account to transfer from.');
      setTransferMoneyLoading(false);
      return;
    }

    try {
      await accountService.transferMoney(fromAccountId, toAccountNumber, transferAmount);
      setTransferMessage('Money transferred successfully!');
      setTransferSuccessful(true);
      fetchAccounts(); // Refresh accounts list
      setToAccountNumber('');
      setTransferAmount(0);
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.detail) 
        ? (typeof error.response.data.detail === 'object' ? JSON.stringify(error.response.data.detail) : error.response.data.detail)
        : error.message || error.toString();
      setTransferMessage(resMessage);
      setTransferSuccessful(false);
    } finally {
      setTransferMoneyLoading(false);
    }
  };

  const handleDeleteAccountClick = (accountId) => {
    setAccountToDelete(accountId);
    setShowDeleteModal(true);
    setDeleteMessage('');
    setDeleteSuccessful(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteMessage('');
    setDeleteSuccessful(false);

    try {
      await accountService.deleteAccount(accountToDelete);
      setDeleteMessage('Account deleted successfully!');
      setDeleteSuccessful(true);
      fetchAccounts(); // Refresh accounts list
      handleCloseDeleteModal();
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.detail) 
        ? (typeof error.response.data.detail === 'object' ? JSON.stringify(error.response.data.detail) : error.response.data.detail)
        : error.message || error.toString();
      setDeleteMessage(resMessage);
      setDeleteSuccessful(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (!currentUser) {
    return <Container><Alert variant="warning">Please log in to view your dashboard.</Alert></Container>;
  }

  return (
    <Container className="dashboard-container">
      <h2 className="mb-4">Welcome, {currentUser.full_name}!</h2>

      {/* Summary Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text className="fs-4">${totalBalance.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Accounts</Card.Title>
              <Card.Text className="fs-4">{accounts.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Create New Account</Card.Title>
              <Form onSubmit={handleCreateAccount}>
                <Form.Group className="mb-3" controlId="formAccountType">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Select value={accountType} onChange={(e) => setAccountType(e.target.value)} required>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="fd">Fixed Deposit</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formInitialDeposit">
                  <Form.Label>Initial Deposit (Min 500)</Form.Label>
                  <Form.Control
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(parseFloat(e.target.value))}
                    min="500"
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100" disabled={createAccountLoading}>
                  {createAccountLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Create Account'}
                </Button>
              </Form>
              {message && (
                <Alert variant={successful ? 'success' : 'danger'} className="mt-3">
                  {message}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Transfer Money</Card.Title>
              <Form onSubmit={handleTransferMoney}>
                <Form.Group className="mb-3" controlId="formFromAccount">
                  <Form.Label>From Account</Form.Label>
                  <Form.Select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required>
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_number} ({account.account_type}) - ${account.balance.toFixed(2)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formToAccountNumber">
                  <Form.Label>To Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter destination account number"
                    value={toAccountNumber}
                    onChange={(e) => setToAccountNumber(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransferAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={transferMoneyLoading}>
                  {transferMoneyLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Transfer'}
                </Button>
              </Form>
              {transferMessage && (
                <Alert variant={transferSuccessful ? 'success' : 'danger'} className="mt-3">
                  {transferMessage}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Your Accounts</Card.Title>
              {accounts.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Account Number</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => {
                      console.log("Account ID:", account.id); // Debugging line
                      return (
                      <tr key={account.id}>
                        <td>{account.account_number}</td>
                        <td><Badge bg={account.account_type === 'savings' ? 'success' : account.account_type === 'current' ? 'primary' : 'info'}>{account.account_type}</Badge></td>
                        <td>${account.balance.toFixed(2)}</td>
                        <td><Badge bg={account.status === 'active' ? 'success' : account.status === 'locked' ? 'warning' : 'danger'}>{account.status}</Badge></td>
                        <td>
                          <Button variant="info" size="sm" onClick={() => setFromAccountId(account.id)} className="me-2">
                            Transfer From
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteAccountClick(account.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No accounts found. Create one!</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this account? This action cannot be undone.
          {deleteMessage && (
            <Alert variant={deleteSuccessful ? 'success' : 'danger'} className="mt-3">
              {deleteMessage}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={deleteLoading}>
            {deleteLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete Account'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardPage;
