import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Importing images and icons
import pdfImg from "../../assets/images/pdf.svg";
import docImg from "../../assets/images/doc.svg";
import viewIcon from "../../assets/images/view-icon.png";
import burnIcon from "../../assets/images/burn-icon.png";

import "./MyDocuments.css";

/* 
In MyDocuments component, first we chech our smart contract availiblity from Goerli Testnet then
we make instance of smart contract and call method of currentId to traverse all documents and 
display them.
*/
/* 
On clicking AllDocuments, you can see all Documents that are minted and view their details. 
On clicking MyDocuments, you can see your documents minted by you also you can view, update and burn them. 
*/

const MyDocuments = ({
  walletConnected,
  secureStorageContract,
  defaultAccount,
}) => {
  const [isBurnLoading, setIsBurnLoading] = useState(null); // Burn button loader state
  const [isLoading, setIsLoading] = useState(false); // page documents loader state
  const [documents, setDocuments] = useState([]); // documents list store state
  const [docsOption, setDocsOption] = useState(false); // is Documents available state
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false); // connection to metamask available state
  const [isNetwork, setIsNetwork] = useState(false); // is Goerli Testnet available state

  useEffect(() => {
    setIsLoading(true);
    getDocuments();
  }, [secureStorageContract, docsOption, isMetaMaskAvailable, isNetwork]);

  // Getting documents list from smart contract
  const getDocuments = async () => {
    let allDocs = []; 
    if (window.ethereum && window.ethereum.isMetaMask) { 
      setIsMetaMaskAvailable(true); 
      if (window.ethereum.networkVersion == "5") { 
        setIsNetwork(true); 
        if (secureStorageContract) { 
          try { 
            var currentId = await secureStorageContract.methods 
              .currentId() 
              .call(); 
          } catch {} 
          for (let i = 1; i <= currentId; i++) { 
            var isFlag = false; 
            try { 
              var myDocsAddress = await secureStorageContract.methods 
                .ownerOf(i) 
                .call(); 
            } catch (err) { 
              isFlag = true; 
            } 
            if (docsOption && !isFlag) { 
            if (myDocsAddress.toLowerCase() === defaultAccount) { 
                const uri = await secureStorageContract.methods 
                  .tokenURI(i) 
                  .call(); 
                const doc = await axios.get(uri); 
                allDocs.push(doc.data); 
              } 
            } else if (!isFlag) {
              const uri = await secureStorageContract.methods 
                .tokenURI(i) 
                .call(); 
              const doc = await axios.get(uri); 
              allDocs.push(doc.data); 
            } 
          } 
          setDocuments(allDocs); 
          setIsLoading(false); 
        } else { 
          console.log("contract not get"); 
        } 
      } else { 
        setIsLoading(false); 
        setIsNetwork(false); 
      } 
    } else {
      setIsLoading(false); 
      setIsMetaMaskAvailable(false); 
    } 
  };

  // Burn button handler
  const burnHandler = async (id) => {
    if (secureStorageContract && docsOption) { 
      if (walletConnected === true) { 
        setIsBurnLoading(id); 
        try { 
          await secureStorageContract.methods 
            .burnDocument(id) 
            .send({ from: defaultAccount }); 
          setIsBurnLoading(null); 
          window.location.reload(); 
        } catch { 
          setIsBurnLoading(null); 
        } 
      } else { 
        alert("Connect your wallet!!!"); 
      } 
    } 
  };

  // All documents button
  function checkPriorityAll() {
    setDocsOption(false);
  }
  // My Documents button
  function checkPriorityMy() {
    setDocsOption(true);
  }

  // Mapping all documents render function
  const RenderItems = () => {
    return documents.map((doc) => (
      <div className="row" key={doc.edition}>
        <div className="col-md-8 col-12 d-flex p-md-5 p-3">
          <div className="pe-md-5 pe-3">
            {doc.attributes[2].value === "pdf" ? (
              <img src={pdfImg} className="" alt="pdf" />
            ) : doc.attributes[2].value === "docx" ? (
              <img src={docImg} className="" alt="doc" />
            ) : null}
          </div>
          <p className="name-text-style">
            {doc.name}
            <p className="desc-text-style pt-2 text-break">{doc.description}</p>
          </p>
        </div>

        <div className="col-md-4 col-12 d-flex justify-content-center p-5">
          <div className="d-flex flex-column">
            <Link to={`/view-document/${doc.edition}`}>
              <button className="view-btn mb-2 ps-4 pt-2 pe-4 pb-2">
                <img src={viewIcon} className="img-fluid me-2" alt="" />
                View
              </button>
            </Link>
            {docsOption ? (
              isBurnLoading === doc.edition ? (
                <div className="row d-flex justify-content-center">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => burnHandler(doc.edition)}
                  className="burn-btn ps-4 pt-2 pe-4 pb-2"
                >
                  <img src={burnIcon} className="img-fluid me-2" alt="" />
                  Burn
                </button>
              )
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid pb-5 pt-5 mt-5 mb-5 d-flex justify-content-center">
      <div className="container view-container w-100 ps-5">
        {isLoading ? (
          <div className="row d-flex justify-content-center">
            <div className="spinner-border text-light mt-5 mb-5" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : isMetaMaskAvailable ? (
          isNetwork ? (
            <div>
              <div className="d-flex align-items-start ms-2">
                <button
                  onClick={checkPriorityAll}
                  className="mt-4 ms-4 doc-list-btn mb-3"
                >
                  {docsOption ? (
                    <div>All Documents</div>
                  ) : (
                    <div style={{ color: "#00598c" }}>All Documents</div>
                  )}
                </button>
                <button
                  onClick={checkPriorityMy}
                  className="mt-4 ms-2 doc-list-btn mb-3"
                >
                  {docsOption ? (
                    <div style={{ color: "#00598c" }}>My Documents</div>
                  ) : (
                    <div>My Documents</div>
                  )}
                </button>
              </div>
              {documents.length === 0 ? (
                <div
                  className="d-flex justify-content-center align-items-center p-5"
                  style={{ color: "white", fontSize: "50px", height: "60vh" }}
                >
                  No Documents
                </div>
              ) : (
                RenderItems()
              )}
            </div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center p-5"
              style={{ color: "white", fontSize: "50px", height: "60vh" }}
            >
              Connect to Goerli Test Network
            </div>
          )
        ) : (
          <div
            className="d-flex justify-content-center align-items-center p-5"
            style={{ color: "white", fontSize: "50px", height: "60vh" }}
          >
            Install Metamask and Connect
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;
