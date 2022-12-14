import React, { useState, useRef, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {providers, Contract} from "ethers";
import Web3Modal from "web3modal";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";
export default function Home() {
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  ;
  //useRef is used to make a persisting part of a component
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWhitelisted, setnumOfWhitelisted] = useState(0);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async(needSigner = false)=>{
   
  //connect to metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    //wrapping our provider into a class, which we can use in a better manner
    const {chainId} = await web3Provider.getNetwork();
    if (chainId!==4){
      //Not in rinkeby
      window.alert("Change the network to Rinkeby")
      throw new Error ("Change the network to Rinkeby")
    }

    if (needSigner){
      //we need a signer not a provider,
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider
  }

  /*
    connectWallet: Connects the MetaMask wallet
  */

    const addAddressToWhitelist = async () => {
      try {
        // We need a Signer here since this is a 'write' transaction.
        const signer = await getProviderOrSigner(true);
        // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          signer
        );
        // call the addAddressToWhitelist from the contract
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);
        // get the updated number of addresses in the whitelist
        await getNumberOfWhitelisted();
        setJoinedWhitelist(true);
      } catch (err) {
        console.error(err);
      }
    };
  
    /**
     * getNumberOfWhitelisted:  gets the number of whitelisted addresses
     */
    const getNumberOfWhitelisted = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // No need for the Signer here, as we are only reading state from the blockchain
        const provider = await getProviderOrSigner();
        // We connect to the Contract using a Provider, so we will only
        // have read-only access to the Contract
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          provider
        );
        // call the numAddressesWhitelisted from the contract
        const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
        setnumOfWhitelisted(_numberOfWhitelisted);
      } catch (err) {
        console.error(err);
      }
    };
    const checkIfAddressInWhitelist = async () => {
      try {
        // We will need the signer later to get the user's address
        // Even though it is a read transaction, since Signers are just special kinds of Providers,
        // We can use it in it's place
        const signer = await getProviderOrSigner(true);
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          signer
        );
        //the above three lines act as get_account() function 
        // Get the address associated to the signer which is connected to  MetaMask
        const address = await signer.getAddress();
        // call the whitelistedAddresses from the contract
        const _joinedWhitelist = await whitelistContract.WhitelistedAddresses[address]
        setJoinedWhitelist(_joinedWhitelist);
      } catch (err) {
        console.error(err);
      }
    };
  
    const connectWallet = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // When used for the first time, it prompts the user to connect their wallet
        await getProviderOrSigner();
        setWalletConnected(true);
         checkIfAddressInWhitelist();
         getNumberOfWhitelisted();
      } catch (err) {
        console.error(err);
      }
    };
  const renderButton = () => {
      if (walletConnected) {
        if (joinedWhitelist) {
          return (
            <div className={styles.description}>
              Thanks for joining the Whitelist!
            </div>
          );
        } else if (loading) {
          return <button className={styles.button}>Loading...</button>;
        } else {
          return (
            <button onClick={addAddressToWhitelist} className={styles.button}>
              Join the Whitelist
            </button>
          );
        }
      } else {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        );
      }
    };
  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);


  

  return (
    <div>
      <Head>
        <title>Whitelist DApp</title>
        <meta name="description" content = "Whitelist-Dapp"/>
      </Head>
      <div className = {styles.main}>
      <div>
        <h1 className={styles.title}>
          Welcome to Crypto Devs!
        </h1>
        <br/>
        <div className = {styles.description}>
          {numOfWhitelisted} have already joined the Whitelist
        </div>
        {renderButton()}
      </div>
        
      <div><img className={styles.image} src = "./crypto-devs.svg"/></div>
        
      </div>
      <footer className={styles.footer}>Made with love by Nabeel</footer>
    </div>
  )
}
//useRef = persists for lifetime of component
//basically it connects the very first instant that it is reloaded 
