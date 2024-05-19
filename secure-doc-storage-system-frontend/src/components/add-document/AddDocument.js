import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import "./AddDocument.css";
import {PROJECT_ID, PROJECT_SECRET, SUB_DOMAIN} from "../../INFURA_IPFS_IDS.js"

/* 
  This file description
  In add document, we get name,file(doc, pdf) format and description as input data.
  On click button mint, first we check our connection to IPFS then we check our connection to metamask wallet.
  Then our file will uploadoad on IPFS and we get URL of our data. Then we Mint this Url on blockchain network. 
*/

const AddDocument = ({
walletConnected,
secureStorageContract,
defaultAccount,
}) => {
const [isMintLoading, setIsMintLoading] = useState(false); // Mint button loader
const [fileName, setFileName] = useState(null); // User input file name store state
const [docFile, setDocFile] = useState(null); // User input file store state
const [isFilePicked, setIsFilePicked] = useState(false); // file picked check state
const [name, setName] = useState(""); // User entered name store state
const [desc, setDesc] = useState(""); // User entered description state
const [fileType, setFileType] = useState(""); // User input file type store state
const [fileSize, setFileSize] = useState(""); // User input file size store state

// IPFS projectID and Project Secret Key
const projectId = PROJECT_ID;
const projectSecret = PROJECT_SECRET;

// Authoriztion Method
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  "base64"
)}`;

// Ipfs connection
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// Input file handler
function handleFileChange(event) {
  let file = event.target.files[0];
  if (file) {
    setFileName(file.name.split(".").shift());
    setDocFile(file);
    setFileSize(file.size);
    setFileType(file.name.split(".").pop());
    setIsFilePicked(true);
  } else {
    console.log("file not selected");
  }
}

// Mint button handler
const mintHandler = async (e) => {
  e.preventDefault(); 
  if (walletConnected === true) { 
    if (ipfs) { 
      console.log("ipfs connected"); 
      if (name && desc && docFile) { 
        if (fileType === "pdf" || fileType === "docx") { 
          setIsMintLoading(true); 
          let currentData = new Date().getTime(); 
          // Uploading document to IPFS and getting url 
          const result = await ipfs.add(docFile); 
          const url = `https://`+SUB_DOMAIN+`.infura-ipfs.io/ipfs/${result.path}`;  
          // get current ID and add +1 
          let currentId = await secureStorageContract.methods 
            .currentId() 
            .call(); 
          currentId = parseInt(currentId) + 1; 
          // metadata object to upload data on ipfs 
          const metadata = { 
            name: name.toUpperCase(), 
            description: desc, 
            file: url, 
            date: currentData, 
            edition: currentId, 
            attributes: [ 
              { 
                trait_type: "File Name", 
                value: fileName, 
              }, 
              { 
                trait_type: "File Size", 
                value: fileSize, 
              }, 
              { 
                trait_type: "File Type", 
                value: fileType, 
              }, 
            ], 
          }; 
          // Uploading metadata to IPFS and getting URL 
          const added = await ipfs.add(JSON.stringify(metadata)); // uploading data on IPFS 
          const tokenURI = `https://`+SUB_DOMAIN+`.infura-ipfs.io/ipfs/${added.path}`; 
          // Minting URL we got from IPFS. 
          try { 
            await secureStorageContract.methods 
              .mintDocument(tokenURI) 
              .send({ from: defaultAccount }); 
            setIsMintLoading(false); 
            setName(""); 
            setDesc(""); 
            setDocFile(null); 
            setIsFilePicked(false); 
          } catch { 
            setIsMintLoading(false); 
          } 
        } else { 
          alert("Select the correct file format!!"); 
        } 
      } else { 
        alert("input not entered"); 
      } 
    } else { 
      alert("ipfs not connected"); 
    } 
  } else { 
    alert("connect your wallet"); 
  } 
};

return (
  <div>
    {ipfs && (
      <form className="input-form-container">
        <div className="mb-3 d-flex justify-content-center">
          <input
            type="text"
            placeholder="Name"
            value={name}
            className="form-control input-form-box"
            onChange={(e) => setName(e.target.value)}
            id="name"
          />
        </div>

        {isFilePicked ? (
          <div className="d-flex justify-content-start mb-3 p-2 input-file-box">
            <label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                id="upload"
                accept=".pdf, .docx"
              />
              {fileName}
            </label>
          </div>
        ) : (
          <label className="mb-3 p-2 d-flex justify-content-between input-file-box">
            <label className="ms-1 " style={{ color: "#767676" }}>
              Select File
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                id="upload"
                accept=".pdf, .doc"
              />
            </label>
            | Browse
          </label>
        )}

        <div className="mb-3 d-flex justify-content-center">
          <textarea
            id="desc"
            value={desc}
            rows="7"
            placeholder="Description"
            className="form-control input-form-box"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        {isMintLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="mb-3 d-flex justify-content-center">
            <button
              className="sub-btn p-1"
              type="submit"
              onClick={mintHandler}
            >
              Mint
            </button>
          </div>
        )}
      </form>
    )}
  </div>
);
};

export default AddDocument;
