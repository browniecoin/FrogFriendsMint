import { v4 as uuidv4 } from 'uuid';
import React, { Component } from 'react';
import axios from 'axios';
import Web3 from 'web3';

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      signature: '',
      csrfToken: '',
      url: 'https://browniecoins.org/home/add_wallet/', // Replace with your target URL
      walletHistory: null,
      walletLeaders: null,
      leadersString: '',
      leadersData: [],
      accountAddress: '',
      address: '',
      amount: '',
    };
  }

  componentDidMount() {
    this.fetchCsrfToken();
    this.shortenWalletAddresses();
  }

  async fetchCsrfToken() {
    try {
      const response = await axios.get('/home/get_csrf_token');
      const csrfToken = response.data.csrf_token;
      this.setState({ csrfToken });

      const walletHistoryResponse = await axios.get(`/home/get_wallet_history?wallet_address=${this.state.accountAddress}`);
      const parsedResponse = JSON.parse(walletHistoryResponse.data);
      this.setState({ walletHistory: parsedResponse });

      try {
        const walletLeadersResponse = await axios.get(`/home/get_leaders/`);
        this.setState({ walletLeaders: walletLeadersResponse.data.leaders });

        const leadersString = JSON.stringify(walletLeadersResponse.data.leaders, null, 2);
        const parsedData = JSON.parse(leadersString);

        this.setState({
          leadersData: parsedData,
          leadersString: leadersString,
        });

        console.log(leadersString);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }

  shortenWalletAddresses() {
    const spanElements = document.querySelectorAll('.wallet_address_span');

    spanElements.forEach((spanElement) => {
      const accountAddress = spanElement.innerText;

      if (accountAddress.length >= 8) {
        const shortenedAddress = accountAddress.substring(0, 4) + '...' + accountAddress.slice(-4);
        spanElement.innerText = shortenedAddress;
      }
    });
  }

  async signMessage(message, account) {
    try {
      const web3 = new Web3(window.ethereum);
      const signedMessage = await web3.eth.personal.sign(message, account, '');
      return signedMessage;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error; // Rethrow the error for handling in the caller function
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.postregisterPartyAddresses(this.state.address, this.state.amount);
  };

  async handleClick() {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];

      // Generate a unique nonce (key)
      const key = uuidv4();

      // Call the signMessage function to generate the signature
      const signature = await this.signMessage(key, account);

      const data = {
        key: key,
        value: this.state.accountAddress,
        accountAddress: this.state.accountAddress,
        signature: signature, // Attach the signature to the payload
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.state.csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify(data),
      };

      // Send the data to the server and get the response
      // const response = await fetch(this.state.url, requestOptions);
      // const responseData = await response.text();
      // document.getElementById("verified_button").innerText = "Verified";

      this.props.claimPunk(this.state.punkid);
    } catch (error) {
      console.error('Error handling click event:', error);
    }
  }

  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1 className="display-5">Verify Wallet Address</h1>
          <div className="card col-md-12">
            <div className="card-body">
              <hr className="my-4" />
              <p>
                <a href={`/home/my_profile/`}>My Profile</a>
              </p>
              <h2>Register Party Addresses</h2>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <label>Referral Address:</label>
                  <input
                    type="text"
                    value={this.state.address}
                    onChange={(e) => this.setState({ address: e.target.value })}
                  />
                </div>
                <div>
                  <label>Bonus Amount:</label>
                  <input
                    type="text"
                    value={this.state.amount}
                    onChange={(e) => this.setState({ amount: e.target.value })}
                  />
                </div>
                <button type="submit">Register</button>
              </form>
              <hr className="my-5" />
              <p>
                My Wallet Address: <span className="wallet_address_span">{this.state.accountAddress}</span>
                <input type="hidden" name="accountAddress" value={this.state.accountAddress} />
                <input type="hidden" name="csrf_token" value={this.state.csrfToken} />
              </p>
              <hr className="my-1" />
              <button onClick={this.handleClick} id="verified_button">
                Verify
              </button>
              <hr className="my-4" />
              <input
                type="hidden"
                value={this.state.signature}
                readOnly
                placeholder="Signature"
                style={{ width: '100%' }}
              />

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
                  {this.state.leadersData.map((leader, index) => (
                    <tr key={index}>
                      <td>
                        <span className="wallet_address_span">{leader.token_owner}</span>
                      </td>
                      <td>{leader.token_count}</td>
                      <td>{leader.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr className="my-4" />
              {this.state.walletHistory && (
                <div>
                  <h2>Token Records</h2>
                  <ul>
                    {this.state.walletHistory.token_records &&
                      this.state.walletHistory.token_records.map((record, index) => {
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
                    {this.state.walletHistory.token_balances &&
                      this.state.walletHistory.token_balances.map((balance, index) => (
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
  }
}

export default AccountDetails;
