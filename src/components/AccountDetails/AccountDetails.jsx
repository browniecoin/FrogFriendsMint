export default AccountDetails;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3'; // Corrected import order
import { v4 as uuidv4 } from 'uuid';

const AccountDetails = ({ accountAddress }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [walletHistory, setWalletHistory] = useState(null);
  const [leadersData, setLeadersData] = useState([]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/home/get_csrf_token');
        const csrfToken = response.data.csrf_token;
        setCsrfToken(csrfToken);

        const walletHistoryResponse = await axios.get(`/home/get_wallet_history?wallet_address=${accountAddress}`);
        const parsedResponse = JSON.parse(walletHistoryResponse.data);
        setWalletHistory(parsedResponse);

        try {
          const walletLeadersResponse = await axios.get(`/home/get_leaders/`);
          setLeadersData(walletLeadersResponse.data.leaders);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, [accountAddress]);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Your smart contract interaction logic here

    try {
      // Replace 'web3Provider' with your actual Web3 provider
      const web3Provider = new Web3(window.ethereum || window.web3.currentProvider);
      const accounts = await web3Provider.eth.getAccounts();
      if (accounts.length === 0) {
        console.error('No Ethereum accounts available. Make sure you are connected to a wallet.');
        return;
      }

      const account = accounts[0];

      // Your smart contract interaction logic here

    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  // Rest of your component code here

  return (
    <div>
    <div className="jumbotron">
      <h1 className="display-5">Verify Wallet Address</h1>
      <div class="card col-md-12" >
        <div class="card-body">

                    <hr className="my-4" />
                    <p>
                    <a href={`/home/my_profile/`}>My Profile</a>
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label>Recipient Address:</label>
                        <input
                          type="text"
                          value={address}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div>
                        <label>Amount to Send:</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={handleAmountChange}
                        />
                      </div>
                      <button onClick={connectWallet}>Connect Wallet</button>

                      <button type="submit">Send</button>
                    </form>
                    <p>
                    My Wallet Address: <span class="wallet_address_span" >{accountAddress}</span>
                    <input type="hidden" name="accountAddress" value={accountAddress} />
                    <input type="hidden" name="csrf_token" value={csrfToken} />
                    <hr className="my-1" />
                    <button onClick={handleClick} id="verified_button">Verify</button>
                    <hr className="my-4" />

                    <input
                      type="hidden"
                      value={signature}
                      readOnly
                      placeholder="Signature"
                      style={{ width: '100%' }}
                    />
                    </p>

                    <h1>Top Leaders</h1>
                    <table>
                      <thead>
                        <tr>
                          <th>Owner</th>
                          <th>Count</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadersData.map((leader, index) => (
                          <tr key={index}>
                            <td><span class="wallet_address_span" >{leader.token_owner}</span></td>
                            <td>{leader.token_count}</td>
                            <td>{leader.balance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                      <hr className="my-4" />
                    {walletHistory && (
                      <div>
                        <h2>Token Records</h2>
                        <ul>
                        {walletHistory.token_records &&
                          walletHistory.token_records.map((record, index) => {
                            const tokens = record.split(' - ');
                            const tokenName = tokens[0];
                            const tokenAddress = tokens[1];
                            const dateString = tokens[2];
                            const date = new Date(dateString);

                            // Format the date as needed, for example, in a human-readable format
                            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                            return (
                              <li key={index}>
                                {`${tokenName} - ${tokenAddress} - ${formattedDate}`}
                              </li>
                            );
                          })}
                        </ul>
                          <hr className="my-4" />
                        <h2>Token Balances</h2>
                        <ul>
                          {walletHistory.token_balances && walletHistory.token_balances.map((balance, index) => (
                            <li key={index}>{balance}</li>
                          ))}
                        </ul>
                      </div>
                    )}

        </div>
      </div>
    </div>
    </div>
  );
};

export default AccountDetails;
