import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewDocument.css";

/*All images and icons import here */
import pdfImg from "../../assets/images/pdf.svg";
import docImg from "../../assets/images/doc.svg";
import descIcon from "../../assets/images/desc-icon.svg";
import propIcon from "../../assets/images/prop-icon.svg";
import addressIcon from "../../assets/images/address-icon.svg";
import editIcon from "../../assets/images/edit-icon.svg";
import backIcon from "../../assets/images/back-icon.svg";

const ViewDocuments = ({
  walletConnected,
  secureStorageContract,
  defaultAccount,
  contractAddress,
}) => {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getDocument();
  }, [secureStorageContract]);

  /* Getting document information from smart contract using document id and then display */
  const getDocument = async () => {
    if (secureStorageContract) {
      // Getting TokenId by using Contarct Instance
      const uri = await secureStorageContract.methods
        .tokenURI(params.id)
        .call();

      // fetching information from URL using axios
      const doc = await axios.get(uri);

      const myDocsAddress = await secureStorageContract.methods
        .ownerOf(params.id)
        .call();
      if (myDocsAddress.toLowerCase() === defaultAccount) {
        setIsEdit(true);
      }
      setDocument(doc.data);
      setIsLoading(false);
    } else {
      console.log("contract not received");
    }
  };

  return (
    <div className="mb-5">
      {isLoading ? (
        <div className="row d-flex justify-content-center">
          <div className="spinner-border text-light mt-5 mb-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="full-view-document" key={document.edition}>
            <div className="container-fluid pt-5">
              <div className="row">
                <Link to="/my-documents">
                  <img
                    src={backIcon}
                    className="img-fluid ps-5 ms-5 pt-2"
                    alt=""
                  />
                </Link>
              </div>
              <div className="container view-container w-75 mt-5 pe-5">
                <div className="row">
                  <div className="col-xl-5  ">
                    <div className="d-flex justify-content-center p-5">
                      {document.attributes[2].value === "pdf" ? (
                        <img
                          src={pdfImg}
                          className="img-fluid pdf-img"
                          alt=""
                        />
                      ) : document.attributes[2].value === "docx" ? (
                        <img
                          src={docImg}
                          className="img-fluid pdf-img"
                          alt=""
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-xl-7  pt-5 ">
                    <div className="d-flex justify-content-between">
                      <p className="heading-text-document">{document.name}</p>
                      {isEdit ? (
                        <Link to={`/update-document/${document.edition}`}>
                          <p className="text-light">
                            <img src={editIcon} className="img-fluid" alt="" />
                          </p>
                        </Link>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className="row">
                      <p className="title-text-document pt-5">
                        <img
                          src={descIcon}
                          className="img-fluid pe-2 mb-1"
                          alt=""
                        />
                        Description
                      </p>
                      <p className="desc-text-document text-break">
                        {document.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-5 ">
                    <div className="pb-5 ps-4 m-2">
                      <p className="title-text-document">
                        <img
                          src={propIcon}
                          className="img-fluid pe-2 mb-1"
                          alt=""
                        />
                        Properties
                      </p>
                      <div className="row d-flex justify-content-between pe-4">
                        {document ? (
                          document.attributes.map((a) => (
                            <div className="col mb-2">
                              <div className="properties-mini-box p-2">
                                <p className="properties-head-text">
                                  {a.trait_type}
                                </p>
                                <p className="properties-value-text">
                                  {a.value}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7 ">
                    <p className="title-text-document">
                      <img
                        src={addressIcon}
                        className="img-fluid pe-2 mb-1"
                        alt=""
                      />
                      Contract Address
                    </p>
                    <p className="desc-text-document">{contractAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-view-document" key={document.edition}>
            <div className="container-fluid pt-5">
              <div className="row">
                <Link to="/my-documents">
                  <img src={backIcon} className="img-fluid pe-5" alt="" />
                </Link>
              </div>
              <div className="container view-container w-75 mt-5 pe-5">
                <div className="row ms-2">
                  <div className="d-flex justify-content-end flex-column mt-4">
                    <div className="d-flex justify-content-between">
                      <p className="heading-text-document">
                        <img
                          src={pdfImg}
                          className="img-fluid pdf-img pe-3"
                          alt=""
                        />
                        {document.name}
                      </p>
                      <Link to={`/update-document/${document.edition}`}>
                        <p className="text-light">
                          <img
                            src={editIcon}
                            className="img-fluid pt-3"
                            alt=""
                          />
                        </p>
                      </Link>
                    </div>
                    <div className="row">
                      <p className="title-text-document">
                        <img
                          src={descIcon}
                          className="img-fluid pe-2 mb-1"
                          alt=""
                        />
                        Description
                      </p>
                      <p className="desc-text-document ms-3 text-break">
                        {document.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row ms-2">
                  <div className="properties-box pb-5">
                    <p className="title-text-document pe-5">
                      <img
                        src={propIcon}
                        className="img-fluid pe-2 mb-1"
                        alt=""
                      />
                      Properties
                    </p>

                    <div className="row d-flex justify-content-between">
                      {document ? (
                        document.attributes.map((a) => (
                          <div className="col mb-2">
                            <div className="properties-mini-box p-2">
                              <p className="properties-head-text">
                                {a.trait_type}
                              </p>
                              <p className="properties-value-text">{a.value}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row ms-2">
                  <p className="title-text-document">
                    <img
                      src={addressIcon}
                      className="img-fluid pe-2 mb-1"
                      alt=""
                    />
                    Contract Address
                  </p>
                  <p className="desc-text-document ms-2 pb-3 text-break">
                    {contractAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDocuments;
