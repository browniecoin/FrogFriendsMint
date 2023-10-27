import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from the uuid library
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AccountDetails = ({ accountAddress, accountBalance }) => {
  const [value, setValue] = useState('');
  const [signature, setSignature] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const url = 'https://browniecoins.org/home/add_wallet/'; // replace with your target URL
  const [walletHistory, setWalletHistory] = useState(null);
  const [walletLeaders, setWalletLeaders] = useState(null);
  const [leadersString, setLeadersString] = useState('');
  const [leadersData, setLeadersData] = useState([]);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');



  useEffect(() => {
    // Function to fetch the CSRF token
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
          setWalletLeaders(walletLeadersResponse.data.leaders);
          const leadersString = JSON.stringify(walletLeadersResponse.data.leaders, null, 2);
          const parsedData = JSON.parse(leadersString);
          setLeadersData(parsedData);
          console.log(leadersString);
          setLeadersString(leadersString);
          //const parsedLeadersResponse = JSON.parse(walletLeadersResponse.data);
          //alert(parsedLeadersResponse)
          //setWalletLeaders(parsedLeadersResponse);
        } catch (error) {
          console.error(error);
          alert(error);
        }

      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();

    const spanElements = document.querySelectorAll('.wallet_address_span');

    spanElements.forEach((spanElement) => {
      const accountAddress = spanElement.innerText;

      if (accountAddress.length >= 8) {
        const shortenedAddress = accountAddress.substring(0, 4) + '...' + accountAddress.slice(-4);
        spanElement.innerText = shortenedAddress;
      }
    });
    // Call the fetchCsrfToken function when the component mounts

  }, []);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const connectWallet = async () => {


    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
        } catch (error) {
          console.error("User denied account access:", error);
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask or another Ethereum-compatible wallet.");
      }
    };

  const handleSubmit = async (event) => {

    const account = 0;



    event.preventDefault();
    console.log('Register Address: ', accountAddress);
    console.log('Referred By: ', address);
    console.log('Bonus Amount: ', amount);

    const { abi } = require('../../abis/PepeToken.json');

    const contractAddress = '0x97304B4BD21Aa48Ba7571cea8DA49419C8ab6a73';
    const smartContract = new web3Provider.eth.Contract(abi, contractAddress);

    // Call loadWeb3 to ensure Web3 is properly loaded
    await loadWeb3();

    // Now you can proceed with interacting with the smart contract

    // Replace 'web3Provider' with your actual Web3 provider
    const web3Provider = window.web3;

    if (!web3Provider) {
      console.error("Web3 is not available. You should consider using a browser with MetaMask or a compatible wallet.");
      return;
    }


      if (window.ethereum) {
        try {
          await window.ethereum.enable(); // Request account access
          const accounts = await web3Provider.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            const account = accounts[0];
            // Update your state or perform actions with the connected account here
            console.log("Connected to wallet. Account: ", account);
          } else {
            console.error("No Ethereum accounts available. Make sure you are connected to a wallet.");
          }
        } catch (error) {
          console.error("User denied account access:", error);
        }
      } else {
        console.error("Ethereum provider not found. Make sure you are using a compatible wallet.");
      }
    };

    const accounts = await web3Provider.eth.getAccounts();

    if (accounts.length === 0) {
      console.error("No Ethereum accounts available. Make sure you are connected to a wallet.");
      return;
    }


    // Add your logic for handling the form submission here
    // You can call the 'registerPartyAddresses' method here

    try {
      const tx = await smartContract.methods.registerPartyAddresses(accountAddress, address, amount).send({ from: account });
      console.log('Transaction Hash:', tx.transactionHash);
    } catch (error) {
      console.error('Error sending the transaction:', error);
    }
  };





  const signMessage = async (message, account) => {
    try {
      const web3 = new Web3(window.ethereum);
      const signedMessage = await web3.eth.personal.sign(message, account, '');
      return signedMessage;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error; // Rethrow the error for handling in the caller function
    }
  };

  const handleClick = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];

      // Generate a unique nonce (key)
      const key = uuidv4();

      // Call the signMessage function to generate the signature
      const signature = await signMessage(key, account);

      const data = {
        key: key,
        value: accountAddress,
        accountAddress: accountAddress,
        signature: signature, // Attach the signature to the payload
      };

      const url = '/home/add_wallet/';

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify(data),
      };

      // Send the data to the server and get the response

      const response = await fetch(url, requestOptions);
      const responseData = await response.text();
      document.getElementById("verified_button").innerText = "Verified";
    } catch (error) {
      console.error('Error handling click event:', error);
    }
  };



  return (
    <div>

    </div>
  );
};

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
