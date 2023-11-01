import React, { useEffect, useState, useRef } from "react";
import metamaskIcon from "./metamask.svg";
import Web3 from 'web3';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from the uuid library
// import { Entity, Scene } from "aframe-react";
import "./styles.css";

import axios from 'axios';
import * as d3 from 'd3';

const ConnectToMetamask = ({ connectToMetamask }) => {
  const [value, setValue] = useState('');



  return (
    <div className="container" >
      <div className="jumbotron custom-jumbotron">
        <h1 className="display-5 text-center">
          Brownie Coin
        </h1>
        <h3 className="display-5 p-4 text-center">
          Worthless in Value, Priceless in Fun!
        </h3>
        <img src="images/browniewood.gif" width="100%" alt="Brownie Coin" />
        <p className="mt-3">
        Welcome to the Home of Brownie Coin, where we've fused the whimsy of brownie points with the world of cryptocurrencies. Our digital assets ecosystem is refreshingly different, with the essence of our meme coin being essentially worthless, but its community, nostalgia, and art are priceless. Join us for a lighthearted crypto adventure where fun takes precedence over financial pressure, and where we celebrate the essence of brownie points in the digital age. Come on board and explore a cryptocurrency community like no other!
        </p>
        <p className="p-5">
          <canvas id="coinSupplyChart" ></canvas>
        </p>
        <p >
        In a world often driven by financial incentives, there are countless moments that go unnoticed and unrewarded. Acts of kindness, going the extra mile, or simply being there for someone in a time of need often escape the spotlight. That's where Brownie Coin comes in – a unique digital currency developed to celebrate and reward the unsung heroes in our lives.
        </p>
        <p><img src="images/logo.gif" width="100%" alt="Brownie Coin" /></p>
        <hr className="my-4" />
        The Spirit of Brownie Coin, named after the delicious treat that warms hearts, represents a new way of acknowledging and appreciating the thoughtful gestures and good deeds that are priceless in their own right. It's a digital token that carries the essence of gratitude, recognizing those moments when a monetary reward isn't quite the right fit.
        <hr className="my-4" />
        <p className="p-5 border">
          <canvas id="coinMiningChart" ></canvas>
        </p>
        <hr className="my-4" />
        Brownie Coin is designed to be an easy-to-use, secure, and meaningful way to reward people for their exceptional actions.
        <p className="p-5 border">
          <canvas id="hashPowerChart" ></canvas>
        </p>
        <hr className="my-4" />
        Collect your Brownie Coin and share them with friends, family, and colleagues to inspire a ripple effect of kindness.
        <hr className="my-4" />
        Why Choose Brownie Coin
        <hr className="my-4" />
        1. **Heartfelt Recognition**: Brownie Coin adds a personal touch to your gratitude, making it more meaningful than a simple "thank you."
        <hr className="my-4" />
        2. **Inspire Others**: By recognizing and rewarding good deeds, Brownie Coin inspires others to follow suit and create a more compassionate world.
        <hr className="my-4" />

                    <p className="p-2">

                    <a href="https://github.com/browniecoin" ><i class="fab fa-github large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="/downloads/Brownie-Qt.dmg" ><i class="fab fa-apple large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="https://api.browniecoins.org" ><i class="fas fa-network-wired large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="https://x.com/browniecoins" ><i class="fab fa-twitter large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="https://t.me/browniecoin" ><i class="fab fa-telegram large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="/home/" ><i class="fas fa-key large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="/home/static/wallet/index.html" ><i class="fas fa-wallet large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="https://www.youtube.com/@browniecoin" ><i class="fab fa-youtube large-icon"></i></a>
                    &nbsp;&nbsp;
                    <a href="https://www.tiktok.com/@browniecoin" ><i class="fab fa-tiktok large-icon"></i></a>

                    <hr className="my-4" />
                    <button
                      onClick={connectToMetamask}
                      className="btn btn-primary d-flex align-items-center"
                      style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                    >
                      Connect Wallet
                    </button>
                    </p>

                <hr className="my-4" />

                <p>
                Connect your wallet or sign in to access a world of Brownie Coin Digital Asset excitement. Update your socials to showcase your unique assets, check out the leaderboards,
                Join us today and dive into the vibrant world of Brownie Coin!
                </p>

        <hr className="my-4" />
        <h3>Rewarding Good Deeds, The Sweet Way!</h3>
        <p><img src="images/home.gif" width="100%" alt="Brownie" /></p>
        <p>
          In a world where kindness, hard work, and going the extra mile deserve recognition beyond mere words, enter Brownie Coin!
          Brownie Coin is a delightful and innovative way to show your appreciation to those who make a difference, even in situations where traditional monetary rewards may not be culturally appropriate or necessary.
        </p>

        <h3>What We Offer</h3>
        <p>
            Introducing the Brownie Coin Leaderboard App – your go-to resource for staying ahead in the Brownie Coin market. This cutting-edge platform lets you search profiles by social media handles, providing real-time insights into their Brownie digital asset holdings. Dive into historical performance data and see how the leaders are shaping the market. With daily blockchain data updates, you'll always have the latest information at your fingertips. Plus, our leaderboard ranks profiles based on their Brownie asset holdings, offering a competitive edge and fostering community engagement. Don't miss out on the action – get in the game with the Brownie Coin Leaderboard App today!
            <hr className="my-4" />

            Proof of Work Blockchain: Introducing <a href="https://blockspot.io/coin/brownie-coin/" ><b>Brownie Coin</b></a> PoW, the OG meme coin, a proof-of-work blockchain that champions miners as the linchpin of the network, emphasizing decentralization and security. Unlike traditional cryptocurrencies, Brownie Coin's value derives from humor and playfulness, featuring a unique token supply system inspired by "brownie points." Join us in reshaping the crypto landscape, putting miners first and fostering a fun, rewarding community experience.

            <hr className="my-1" />
            <img src="/home/get_brownie_note/" width="100%" alt="Brownie Coin" />
            <hr className="my-4" />
            <h3>BrownieCoin.eth Deployer Ethereum Token</h3>
            <hr className="my-4" />

            NFT Collection: Explore our unique <a href="https://opensea.io/collection/brownie-coins" >NFT</a> collection, featuring a blend of art and utility. Own exclusive digital assets that go beyond aesthetics and offer practical uses.
            <hr className="my-4" />
            ERC-20 Token: Fuel your journey with our native ERC-20 token. Use it for transactions, or governance, and be part of the Brownie Coin ecosystem.
        </p>
        <p>
        <hr className="my-2" />
        CA <a href="https://etherscan.io/token/0x0d2f8ee4194d79bbf4fee6c1f14ea5a0f5075b13" >0x0d2f8EE4194D79bBF4fee6c1f14ea5a0f5075b13</a>
        <hr className="my-2" />
        <a href="https://www.dextools.io/app/en/ether/pair-explorer/0x91b45cf002c27bb0b077496ce839a8194d73b37c" >Dextools</a>
        </p>

        <hr className="my-4" />
        <p>
        Brownie Coin Token has utility within the platform, allowing users to access premium features, vote on platform upgrades, and participate in governance decisions.
        </p>
        <p><img src="images/tax.gif" width="100%" alt="Tax" /></p>
        <p>
        Team and Advisors (15%): Allocated 15% of the total supply to the core team and advisors as a reward for their efforts and to align their interests with the project's success.
        </p>
        <p>
        Ecosystem Development (25%): Allocated 25% of the total supply for ecosystem development. This fund can be used for partnerships, marketing, community incentives, and building integrations with other projects.
        </p>
        <p>
        Community Rewards (20%): Reserved 20% of the total supply for community rewards and incentives. These tokens can be distributed to users who actively participate in the platform, such as creating content, sharing recipes, or referring new users.
        </p>
        <p>
        Liquidity Pool (30%): Allocated 30% of the total supply to a liquidity pool on a decentralized exchange (DEX) like Uniswap. This provides liquidity for trading BRWN and ensures price stability.
        </p>
        <p>
        Reserve Fund (10%): To address unforeseen circumstances or future expansion.
        </p>
        <p>
        Contract Renouncement and Liquidity Lock,

        We are pleased to inform our community that the contract for Brownie Coin will be renounced, and liquidity will be locked. This significant step demonstrates our dedication to transparency and security within our project. Thank you for your ongoing support.

        </p>
        <hr className="my-4" />
        <p className="p-5 border">
        Brownie Coin isn't just a coin; it's also a software as a service provider offering solutions to some of the most advanced payment providers in the industry.
        Upon reviewing the Brownie Coin leader board app's code base, you'll quickly recognize its seamless integration with cutting-edge Banking as a Service Solution Providers.
        Empowering users with KYC verification, FDIC-insured bank account creation, credit cards powered by Visa, and loan requests – all within one platform.
        </p>
        <hr className="my-2" />
        BrownieCoins.org &copy; 2023 All rights reserved.
        <hr className="my-2" />
      </div>
    </div>
  );
};

export default ConnectToMetamask;
