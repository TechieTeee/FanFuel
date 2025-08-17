// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FanFuelFlowNFT
 * @dev Flow EVM NFT contract for FanFuel reaction NFTs
 * Consumer-friendly NFT experience on Flow EVM
 */
contract FanFuelFlowNFT is ERC721, Ownable, ReentrancyGuard {
    
    uint256 private _tokenIdCounter;
    
    // Reaction metadata
    struct ReactionData {
        string athleteId;
        string athleteName;
        string reactionType; // clap, fire, gem, strong, legend, king
        uint256 supportAmount;
        string commentary;
        uint256 timestamp;
        string rarity;
    }
    
    // Mappings
    mapping(uint256 => ReactionData) public reactions;
    mapping(string => uint256) public reactionCosts;
    
    // Events
    event ReactionNFTMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string athleteId,
        string reactionType
    );
    
    constructor() ERC721("FanFuel Reaction NFTs", "FFNFT") Ownable(msg.sender) {
        // Initialize reaction costs (Flow EVM gas efficient)
        reactionCosts["clap"] = 0.01 ether;    // ~$2 equivalent
        reactionCosts["fire"] = 0.025 ether;   // ~$5 equivalent
        reactionCosts["gem"] = 0.05 ether;     // ~$10 equivalent
        reactionCosts["strong"] = 0.075 ether; // ~$15 equivalent
        reactionCosts["legend"] = 0.125 ether; // ~$25 equivalent
        reactionCosts["king"] = 0.25 ether;    // ~$50 equivalent
    }
    
    /**
     * @dev Mint reaction NFT for fan support
     */
    function mintReactionNFT(
        address to,
        string memory athleteId,
        string memory athleteName,
        string memory reactionType,
        uint256 supportAmount,
        string memory commentary,
        string memory rarity
    ) external payable nonReentrant {
        require(bytes(athleteId).length > 0, "Invalid athlete ID");
        require(bytes(reactionType).length > 0, "Invalid reaction type");
        uint256 cost = reactionCosts[reactionType];
        require(cost > 0, "Invalid reaction type");
        require(msg.value >= cost, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Store reaction data
        reactions[tokenId] = ReactionData({
            athleteId: athleteId,
            athleteName: athleteName,
            reactionType: reactionType,
            supportAmount: supportAmount,
            commentary: commentary,
            timestamp: block.timestamp,
            rarity: rarity
        });
        
        // Mint NFT
        _safeMint(to, tokenId);
        
        emit ReactionNFTMinted(tokenId, to, athleteId, reactionType);
    }
    
    /**
     * @dev Get reaction data for token
     */
    function getReactionData(uint256 tokenId) external view returns (ReactionData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return reactions[tokenId];
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Update reaction cost (owner only)
     */
    function updateReactionCost(string memory reactionType, uint256 newCost) external onlyOwner {
        reactionCosts[reactionType] = newCost;
    }
    
    /**
     * @dev Get reaction cost
     */
    function getReactionCost(string memory reactionType) external view returns (uint256) {
        return reactionCosts[reactionType];
    }
}