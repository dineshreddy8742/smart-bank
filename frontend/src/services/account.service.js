import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://smart-bank-system-2.onrender.com';

const createAccount = (accountType, initialDeposit) => {
  return axios.post(API_URL + '/accounts/', {
    account_type: accountType,
    initial_deposit: initialDeposit,
  }, { headers: authHeader() });
};

const getAccounts = () => {
  return axios.get(API_URL + '/accounts/', { headers: authHeader() });
};

const transferMoney = (fromAccountId, toAccountNumber, amount) => {
  return axios.post(API_URL + `/accounts/${fromAccountId}/transfer`, {
    to_account_number: toAccountNumber,
    amount: amount,
  }, { headers: authHeader() });
};

const deleteAccount = (accountId) => {
  return axios.delete(API_URL + `/accounts/${accountId}`, { headers: authHeader() });
};

const accountService = {
  createAccount,
  getAccounts,
  transferMoney,
  deleteAccount,
};

export default accountService;
