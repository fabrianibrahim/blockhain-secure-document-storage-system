import { Route, Routes } from "react-router-dom";
import Web3 from "web3";
import { useEffect, useState } from "react";

//importing all components here
import Home from "./components/home/Home";
import Navbar from "./components/navbar/Navbar";
import MyDocuments from "./components/my-documents/MyDocuments";
import AddDocument from "./components/add-document/AddDocument";
import ViewDocument from "./components/view-document/ViewDocument";
import UpdateDocument from "./components/update-document/UpdateDocument";

//importing smart contract abi
import SecureStorage from "./abis/SecureStorage.json";

function App() {

  const [errorMessage, setErrorMessage] = useState(null); // setting error message state
  const [walletConnected, setWalletConnected] = useState(false); // checking wallet connection state
  const [defaultAccount, setDefaultAccount] = useState(null); // connected account address state
  const [displayAccount, setDisplayAccount] = useState(null);

  const [secureStorageContract, setSecureStorageContract] = useState(null); // contarct instance store state
  const [contractDetected, setContractDetected] = useState(false); // check contract availibility status 

  // LOADING BLOCKCHAIN DATA
  const loadBlockchainData = async () => {
  //  WRITE YOUR CODE HERE
  };

  // Function to handle the wallet connection
  const connectWalletHandler = () => {
  //  WRITE YOUR CODE HERE
  };

  // Function to check the account connection
  const accountConnect = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here 2!");

      window.ethereum.request({ method: "eth_accounts" }).then((result) => {
        if (result[0]) {
          console.log("account connected");
          accountChangedHandler(result[0]);
          setWalletConnected(true);
        } else {
          console.log("disconnected");
          accountChangedHandler(null);
          setWalletConnected(false);
        }
      });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, change account state handler
  const accountChangedHandler = (newAccount) => {
    if (newAccount) {
      setDefaultAccount(newAccount);
      if (defaultAccount) {
        var acc =
          defaultAccount.substring(0, 4) +
          "..." +
          defaultAccount.substring(38, 42);
        setDisplayAccount(acc);
      } else {
        setDisplayAccount(null);
      }
    } else {
      console.log("account disconnected");
      setDefaultAccount(null);
      setDisplayAccount(null);
      setWalletConnected(false);
    }
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  try {
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);
  } catch {}

  useEffect(() => {
    accountConnect();
  });

  useEffect(() => {
    async function loadContract() {
      await loadBlockchainData();
    }
    loadContract();
  }, [walletConnected, contractDetected]);

  return (
    <div>
      <Navbar
        errorMessage={errorMessage}
        walletConnected={walletConnected}
        connectWalletHandler={connectWalletHandler}
        defaultAccount={displayAccount}
      />
      <Routes>
        <Route path="/" element={<Home walletConnected={walletConnected} />} />
        <Route
          path="/my-documents"
          element={
            <MyDocuments
              walletConnected={walletConnected}
              secureStorageContract={secureStorageContract}
              defaultAccount={defaultAccount}
            />
          }
        />
        <Route
          path="/upload-document"
          element={
            <AddDocument
              walletConnected={walletConnected}
              secureStorageContract={secureStorageContract}
              defaultAccount={defaultAccount}
            />
          }
        />
        <Route
          path="/view-document/:id"
          element={
            <ViewDocument
              walletConnected={walletConnected}
              secureStorageContract={secureStorageContract}
              defaultAccount={defaultAccount}
              contractAddress={SecureStorage.contractAddress}
            />
          }
        />
        <Route
          path="/update-document/:id"
          element={
            <UpdateDocument
              walletConnected={walletConnected}
              secureStorageContract={secureStorageContract}
              defaultAccount={defaultAccount}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
