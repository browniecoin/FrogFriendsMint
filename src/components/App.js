import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Web3 from "web3";

import OPEPENAI from "../abis/OPEPENAI.json";


import AllCryptoBoys from "./AllCryptoBoys/AllCryptoBoys";
import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyCryptoBoys from "./MyCryptoBoys/MyCryptoBoys";
import PunksForSale from "./PunksForSale/PunksForSale";
import BuyPunk from "./BuyPunk/BuyPunk";

import {Contract} from "@ethersproject/contracts";

import {useLocation} from "react-router-dom";


import db  from "../database";



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      selectedpunkid: "",
      punksforsalebuttonhtml: "Load Punks",
      cryptoBoysContract: null,
      cryptoBoysContractERC: null,
      cryptoBoysMarketContract: null,
      cryptoBoysCount: 0,
      cryptoPunksLoadCount: 1,
      cryptoPunksBuyLoadCount: 0,
      cryptoBoys: [],
      cryptoBoysForSale: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      balanceOf: 0,
      salePrice: "0",
      totalTokensOwnedByAccount: 0,
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
      cryptoBoyPrice: 0,
      currentPage: 0,
      punkOwner: "",
      lotSize: "",
      homeSize: "",
      homeUrl: "",
      mapUrl: "",
      homeAddress: "",
    };
  }

  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Crypto Boy")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Crypto Boy";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      //window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  };

  loadBlockchainData = async () => {
    if (window.web3) {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        this.setState({ metamaskConnected: false });
      } else {
        this.setState({ metamaskConnected: true });
        this.setState({ loading: true });
        this.setState({ accountAddress: accounts[0] });
        let accountBalance = await web3.eth.getBalance(accounts[0]);
        accountBalance = web3.utils.fromWei(accountBalance, "Ether");
        this.setState({ accountBalance });
        this.setState({ loading: false });
        const networkId = await web3.eth.net.getId();
//        const networkData = Loot.networks[networkId];
//        if (networkData) {
          this.setState({ loading: true });

          const { abi } = require('../abis/FrogFriends.json');

          var smart_contract_interface = new web3.eth.Contract(abi, '0x9d741c5DFb12870477C48E7F03c0265896c01Fd0')


          const { abierc } = require('../abis/PepeToken.json');

          var erc20_smart_contract_interface = new web3.eth.Contract(abierc, '0x97304B4BD21Aa48Ba7571cea8DA49419C8ab6a73')

          const cryptoBoysContract = smart_contract_interface;
          const cryptoBoysContractERC = erc20_smart_contract_interface;
/*
  	const cryptoBoysMarketContract = web3.eth.Contract(
            Loot.abi,
            networkData.address
          );
*/
//    const metaHumanContract = new Contract("0x666659a8ca809c431ce9479a261b9f03cb372016", Metahuman, web3.getSigner())
//    const metaHumanContract = web3.eth.Contract(Metahuman, );
//    const balanceOfMH = await metaHumanContract.methods
//      .balanceOf(this.state.accountAddress)
//      .call();
//      window.alert('Balance of MetaHuman' + balanceOfMH);

          this.setState({ cryptoBoysContract });
//          this.setState({ cryptoBoysMarketContract });
  	      this.setState({ contractDetected: true });


          const balanceOf = await smart_contract_interface.methods
            .balanceOf(this.state.accountAddress)
            .call();

          const totalTokensOwnedByAccount = await smart_contract_interface.methods
            .totalSupply()
            .call();
          let punkOwners = [];
          this.state.cryptoBoys = punkOwners;
          this.state.cryptoBoysForSale = [];
          this.state.balanceOf  = balanceOf + "";
          this.state.punksforsalebuttonhtml = "Load Punks";
          this.state.totalTokensOwnedByAccount = totalTokensOwnedByAccount + "";

          for (let i = 0; i < 8000; i++) {
              this.state.cryptoBoys[i]=0x00;
          }

//          (async () => {
//              await this.loadMorePunks(0,8000);
//          })();


          this.setState({totalTokensOwnedByAccount:this.state.totalTokensOwnedByAccount});
          this.setState({balanceOf:this.state.balanceOf});
          this.setState({cryptoBoys:this.state.cryptoBoys});
          this.setState({cryptoBoysForSale:this.state.cryptoBoysForSale});
          this.setState({punksforsalebuttonhtml:this.state.punksforsalebuttonhtml});
          this.setState({currentPage:this.state.currentPage});
  	      this.setState({ loading: false });




        //} else {
          //this.setState({ contractDetected: false });
        //}
      }
    } else {
      //window.alert('Must Install Metamask and Add Binance Network');
    }
  };

  connectToMetamask = async () => {
    if (window.web3) {
      await window.ethereum.enable();
      this.setState({ metamaskConnected: true });
      window.location.reload();
    } else {
      window.alert('Must Install Metamask Extension for Chrome');
    }
  };

mintMyNFT = async (punkIndex, punkPrice) => {
  this.setState({ loading: true });
    this.state.cryptoBoysMarketContract.methods
      .offerPunkForSale(punkIndex, punkPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
};


reservePunksForOwner = async (maxForThisRun) => {
  this.state.cryptoBoysContract.methods
    .reservePunksForOwner(maxForThisRun)
    .send({ from: this.state.accountAddress })
    .on("confirmation", () => {
      localStorage.setItem(this.state.accountAddress, new Date().getTime());
      this.setState({ loading: false });
      window.location.reload();
    });
}

offerPunkForSale = async (punkIndex, punkPrice) => {
  this.setState({ loading: true });


  const price = window.web3.utils.toWei(punkPrice.toString(), "Ether");
    this.state.cryptoBoysMarketContract.methods
      .offerPunkForSale(punkIndex, price)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
};
claimPunk = async (punkIndex) => {
  this.setState({ loading: true });

  const cryptoBoysContract = this.state.cryptoBoysContract;
  const accountAddress = this.state.accountAddress;
  const hardcodedAmount = 0.001;

  try {
    const totalSupply = await cryptoBoysContract.methods.totalSupply().call();

    // Convert mintAmount to Wei by multiplying with 10^18
    const mintAmountWei = hardcodedAmount * punkIndex * 10**18;

    await cryptoBoysContract.methods
      .publicSaleMint(punkIndex)
      .send({ from: accountAddress, value: mintAmountWei })
      .on("confirmation", () => {
        localStorage.setItem(accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
  } catch (error) {
    console.error("Error claiming punk:", error);
    this.setState({ loading: false });
  }
};




buyPunk = async (punkIndex, punkPrice) => {
  this.setState({ loading: true });
  const price = window.web3.utils.toWei(punkPrice.toString(), "Ether");
    this.state.cryptoBoysMarketContract.methods
      .buyPunk(punkIndex)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
};
transferPunk = async (addressTo, punkIndex) => {
  this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .transferPunk(addressTo, punkIndex)
      .send({ from: this.state.accountAddress})
      .on("confirmation", () => {
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
};

postregisterPartyAddresses = async (address, amount) => {

      try {
      const tx = await this.state.cryptoBoysContractERC.methods.registerPartyAddresses(this.state.accountAddress, address, amount).send({ from: this.state.accountAddress });
      console.log('Transaction Hash:', tx.transactionHash);
    } catch (error) {
      console.error('Error sending the transaction:', error);
    }

};


getPunkOwner = async (punkIndex) => {
    let punkOwner = await this.state.cryptoBoysContract.methods
      .punkIndexToAddress(punkIndex)
      .call();
  return punkOwner;
};


  render() {
    return (
      <div className="container">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                    postregisterPartyAddresses={this.postregisterPartyAddresses}

                  />
                )}
              />
              <Route
                path="/mint"
                render={(props) => (
                  <FormAndPreview
                    {...props}
                    mintMyNFT={this.mintMyNFT}
                    buyPunk={this.buyPunk}
                    reservePunksForOwner={this.reservePunksForOwner}
                    offerPunkForSale={this.offerPunkForSale}
                    claimPunk={this.claimPunk}
                    transferPunk={this.transferPunk}
                    nameIsUsed={this.state.nameIsUsed}
                    colorIsUsed={this.state.colorIsUsed}
                    colorsUsed={this.state.colorsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                    punksOfferedForSale={this.punksOfferedForSale}
                    cryptoBoyPrice={this.state.cryptoBoyPrice}
                    getPunkOwner={this.getPunkOwner}
                    getMyPunks={this.getMyPunks}
                    punkOwner={this.state.punkOwner}
                    lotSize={this.state.lotSize}
                    homeSize={this.state.homeSize}
                    homeUrl={this.state.homeUrl}
                    homeAddress={this.state.homeAddress}
                    mapUrl={this.state.mapUrl}
                    />
                  )}
              />
              <Route
                path="/marketplace"
                render={(props) => (
                  <AllCryptoBoys
                    {...props}
                    accountAddress={this.state.accountAddress}
                    cryptoBoys={this.state.cryptoBoys}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCryptoBoy={this.buyCryptoBoy}
                    loadMorePunks={this.loadMorePunks}
                    currentPage={this.state.currentPage}
                  />
                )}
              />
              <Route
                path="/my-tokens"
                render={() => (
                  <MyCryptoBoys
                    loadMorePunks={this.state.loadMorePunks}
                    accountAddress={this.state.accountAddress}
                    cryptoBoys={this.state.cryptoBoys}
                    balanceOf={this.state.balanceOf}
                    selectedpunkid={this.state.selectedpunkid}
                    totalTokensOwnedByAccount={
                      this.state.totalTokensOwnedByAccount
                    }
                  />
                )}
              />
              <Route
                path="/forsale"
                render={() => (
                  <PunksForSale
                    accountAddress={this.state.accountAddress}
                    cryptoBoysForSale={this.state.cryptoBoysForSale}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCryptoBoy={this.buyCryptoBoy}
                    loadMorePunks={this.loadMorePunks}
                    loadPunksForSale={this.loadPunksForSale}
                    punksforsalebuttonhtml={this.state.punksforsalebuttonhtml}
                  />
                )}
              />
              <Route
                path="/buypunk"
                render={(props) => (
                  <BuyPunk
                    {...props}
                    mintMyNFT={this.mintMyNFT}
                    buyPunk={this.buyPunk}
                    reservePunksForOwner={this.reservePunksForOwner}
                    offerPunkForSale={this.offerPunkForSale}
                    claimPunk={this.claimPunk}
                    transferPunk={this.transferPunk}
                    nameIsUsed={this.state.nameIsUsed}
                    colorIsUsed={this.state.colorIsUsed}
                    colorsUsed={this.state.colorsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                    cryptoBoyPrice={this.state.cryptoBoyPrice}
                    getPunkOwner={this.getPunkOwner}
                    getMyPunks={this.getMyPunks}
                    />
                  )}
              />
              <Route path='/nftrade' component={() => {
                   window.location.href = 'https://www.dextools.io/app/en/ether/pair-explorer/0x8964557533b451d22ddf6d76898b4eba89f69141';
                   return null;
              }}/>
              <Route path='/opensea' component={() => {
                   window.location.href = 'https://opensea.io/collection/frogfriends-2';
                   return null;
              }}/>

		</HashRouter>
	  </>
        )}
      </div>
    );
  }
}

export default App;
