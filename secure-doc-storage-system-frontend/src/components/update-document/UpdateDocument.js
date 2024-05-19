import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import axios from "axios";
import "./UpdateDocument.css";
import { PROJECT_ID, PROJECT_SECRET,SUB_DOMAIN } from '../../INFURA_IPFS_IDS';

/* In Update Document component, we are showing the user input fields with the document data 
entered already with the option if he want to update the document data. */

const UpdateDocument = ({
  walletConnected,
  secureStorageContract,
  defaultAccount,
}) => {
  const params = useParams();

  const [isUpdateLoading, setIsUpdateLoading] = useState(false); // Update button loader state
  const [fileName, setFileName] = useState(null); // document file name state
  const [docFile, setDocFile] = useState(null); // document file state
  const [isFilePicked, setIsFilePicked] = useState(false); // is new file picked state
  const [name, setName] = useState(""); // user input name state
  const [desc, setDesc] = useState(""); // user input description state
  const [fileType, setFileType] = useState(""); // input file type state
  const [fileSize, setFileSize] = useState(""); // input file size state
  const [edition, setEdition] = useState(""); // document file edition id

  const [isLoading, setIsLoading] = useState(true); // loader to get document from blockchain
  const [document, setDocument] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getDocument();
  }, [secureStorageContract]);

  // Loading document from smart contract using parameter id
  const getDocument = async () => {
    if (secureStorageContract) {
      const uri = await secureStorageContract.methods
        .tokenURI(params.id)
        .call();
      const doc = await axios.get(uri);

      setDocument(doc.data);
      setName(doc.data.name);
      setDesc(doc.data.description);
      setFileName(doc.data.attributes[0].value);
      setFileSize(doc.data.attributes[1].value);
      setFileType(doc.data.attributes[2].value);
      setEdition(doc.data.edition);
      setIsLoading(false);
    } else {
      console.log("contract not get");
    }
  };

  // IPFS projectID and Project Secret Key
  const projectId = PROJECT_ID;
  const projectSecret = PROJECT_SECRET;
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
    "base64"
  )}`;

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  // input file handler
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

  // Update button handler
  const updateHandler = async (e) => { 
    e.preventDefault(); 
    if (!walletConnected) {
      alert("connect your wallet");
      return;
    }
    if (!ipfs) {
      alert("ipfs not connected");
      return;
    }
    if (fileType === "pdf" || fileType === "docx") { 
      setIsUpdateLoading(true); // Update button loader active 
      let currentData = new Date().getTime(); 
      let url = ""; 
      if (isFilePicked) { 
        const result = await ipfs.add(docFile); 
        url = `https://`+SUB_DOMAIN+`.infura-ipfs.io/ipfs/${result.path}`; 
      } else { 
        url = document.file; 
      } 
      // metadata to update document in smart contract 
      const metadata = { 
        name: name, 
        description: desc, 
        file: url, 
        date: currentData, 
        edition: edition, 
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
      const added = await ipfs.add(JSON.stringify(metadata)); 
      const tokenURI = `https://`+SUB_DOMAIN+`.infura-ipfs.io/ipfs/${added.path}`; 
      // Updating document on blockchain 
      try { 
        await secureStorageContract.methods 
          .updateDocument(edition, tokenURI) 
          .send({ from: defaultAccount }); 
          setIsUpdateLoading(false); 
      } catch { 
        setIsUpdateLoading(false); 
      } 
    } else alert("Select the correct file format!!"); 
  };

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-light mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <form className="form-box">
          <div
            className="d-flex justify-content-center text-center mb-3"
            style={{ color: "#ffffff", fontSize: "30px", fontWeight: "400" }}
          >
            UPDATE DOCUMENT
          </div>
          <div className="mb-3 d-flex justify-content-center">
            <input
              type="text"
              value={name}
              className="form-control form-box-style"
              onChange={(e) => setName(e.target.value)}
              id="name"
            />
          </div>

          {isFilePicked ? (
            <div className="d-flex justify-content-start mb-3 p-2 file-box">
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
            <label className="mb-3 p-2 d-flex justify-content-between file-box">
              {fileName}
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                id="upload"
                placeholder="Select File"
              />
            </label>
          )}

          <div className="mb-3 d-flex justify-content-center">
            <textarea
              id="desc"
              value={desc}
              rows="7"
              className="form-control form-box-style"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          {isUpdateLoading ? (
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
                onClick={updateHandler}
              >
                Update
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default UpdateDocument;