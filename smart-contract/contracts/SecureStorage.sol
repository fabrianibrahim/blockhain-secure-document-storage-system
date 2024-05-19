// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SecureStorage is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using SafeMath for uint256;

    bool public paused = false;

    // Variable to track current token IDs
    uint256 public currentId = 0;

    // Keeping a track of TokenURIs assigned to TokenIDs =================================
    mapping(uint256 => string) private _tokenURIs;

    // Events declaration (need to listen on frontend) ================================
    event DocMinted(address indexed _from, uint256 indexed _tokenId); //Emitted when a new document is minted
    event DocUpdated(address indexed _from, uint256 indexed _tokenId); //Emitted when an existing document is updated
    event DocBurned(address indexed _from, uint256 indexed _tokenId); //Emitted when an existing document is Burned

    constructor() ERC721("SecureStorageSystem", "SSS") {}

    // Function to mint new document =================================
    // @Public can be called publicly
    // @params _TokenURI: IPFS URI containing all metadata for document ====================
    function mintDocument(string memory _tokenURI) public {
        require(!paused, "Contract is paused"); 
        uint256 mintIndex = currentId + 1; 
        _safeMint(msg.sender, mintIndex); 
        _setTokenURI(mintIndex, _tokenURI); 
        currentId++; 
        emit DocMinted(msg.sender, mintIndex); 

    }

    // Function to Update existing document =================================
    // @Public can be called publicly
    // @params _tokenID: id of the token to be updated, _newTokenURI: updated IPFS URI ================
    function updateDocument(uint256 _tokenId, string memory _newTokenURI) public {
        require(!paused, "Contract is paused"); 
        require(msg.sender == ownerOf(_tokenId), "Owner of token doesn't match with address"); 
        _setTokenURI(_tokenId, _newTokenURI); 
        emit DocUpdated(msg.sender, _tokenId);  
    }

    // Function to Burn any existing token
    // @Public, can be called publicly
    // params _tokenID: existing token ID
    function burnDocument(uint256 _tokenId) public {
        require(!paused, "Contact is paused")
        require(msg.sender == ownerOf(_tokenId), "Owner of token doesn't match with address"); 
        _burn(_tokenId)
        emit DocBurned(msg.sender, _tokenId)
    }


    // Function to Set token URI of tokens =================================
    // @Internal can be only called within the contract =========================
    // @params _tokenID: id of token, _tokenURI: IPFS URI to be stored against the token ID ===================
    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual {
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[_tokenId] = _tokenURI;
    }

    // Function to Get MetaData of any token =======================
    // @Public can be called publicly ====================
    // @params _tokenID: tokenID of existing token ======================
    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require( _exists(_tokenId), "ERC721Metadata: URI query for nonexistent token" ); 
        string memory _uri = _tokenURIs[_tokenId]; 
        return string(abi.encodePacked(_uri)); 
    }

    // Function to pause the contract which will stop minting process =================================
    // @public
    // params _state: a boolean
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
}