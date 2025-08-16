// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ReactionNFT
 * @dev Chiliz-native ERC721 NFT for tokenized fan reactions to sports commentary
 * Each NFT represents a fan's support reaction with unique metadata and rarity
 */
contract ReactionNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    using Strings for uint256;
    
    // Reaction types and their minimum values
    enum ReactionType { CLAP, FIRE, GEM, STRONG, LEGEND, KING }
    
    struct ReactionData {
        address fan;
        string athleteId;
        string athleteName;
        ReactionType reactionType;
        uint256 supportAmount;
        string commentary;
        uint256 timestamp;
        string metadataURI;
        bool isSpecial; // For rare/special reactions
    }
    
    struct ReactionRarity {
        string name;
        uint256 minAmount; // Minimum CHZ amount for this reaction
        uint256 tokenMultiplier; // Token reward multiplier
        string emoji;
    }
    
    uint256 private _nextTokenId = 1;
    
    mapping(uint256 => ReactionData) public reactions;
    mapping(ReactionType => ReactionRarity) public reactionRarities;
    mapping(address => uint256[]) public fanReactions;
    mapping(string => uint256[]) public athleteReactions;
    
    // Platform addresses
    address public fanFuelToken; // FanFuelToken contract address
    string public baseMetadataURI;
    
    event ReactionMinted(
        uint256 indexed tokenId,
        address indexed fan,
        string indexed athleteId,
        ReactionType reactionType,
        uint256 supportAmount
    );
    
    event SpecialReactionMinted(
        uint256 indexed tokenId,
        address indexed fan,
        string reason
    );
    
    constructor(
        address _owner,
        string memory _baseMetadataURI
    ) ERC721("FanFuel Reactions", "FUEL-REACT") Ownable(_owner) {
        baseMetadataURI = _baseMetadataURI;
        
        // Initialize reaction rarities with catchy names
        reactionRarities[ReactionType.CLAP] = ReactionRarity("Clap", 2 ether, 1, "CLAP");
        reactionRarities[ReactionType.FIRE] = ReactionRarity("Fire", 5 ether, 2, "FIRE");
        reactionRarities[ReactionType.GEM] = ReactionRarity("Gem", 10 ether, 3, "GEM");
        reactionRarities[ReactionType.STRONG] = ReactionRarity("Strong", 15 ether, 4, "STRONG");
        reactionRarities[ReactionType.LEGEND] = ReactionRarity("Legend", 25 ether, 5, "LEGEND");
        reactionRarities[ReactionType.KING] = ReactionRarity("King", 50 ether, 10, "KING");
    }
    
    /**
     * @dev Mint a reaction NFT when fan supports athlete
     * Called by FanFuelToken contract after successful support
     */
    function mintReaction(
        address fan,
        string memory athleteId,
        string memory athleteName,
        ReactionType reactionType,
        uint256 supportAmount,
        string memory commentary,
        string memory metadataURI
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(msg.sender == fanFuelToken || msg.sender == owner(), "Unauthorized minter");
        require(fan != address(0), "Invalid fan address");
        require(bytes(athleteId).length > 0, "Invalid athlete ID");
        
        ReactionRarity memory rarity = reactionRarities[reactionType];
        require(supportAmount >= rarity.minAmount, "Support amount too low for reaction type");
        
        uint256 tokenId = _nextTokenId++;
        
        // Mint NFT to fan
        _safeMint(fan, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store reaction data
        reactions[tokenId] = ReactionData({
            fan: fan,
            athleteId: athleteId,
            athleteName: athleteName,
            reactionType: reactionType,
            supportAmount: supportAmount,
            commentary: commentary,
            timestamp: block.timestamp,
            metadataURI: metadataURI,
            isSpecial: false
        });
        
        // Update mappings for easy querying
        fanReactions[fan].push(tokenId);
        athleteReactions[athleteId].push(tokenId);
        
        emit ReactionMinted(tokenId, fan, athleteId, reactionType, supportAmount);
        
        return tokenId;
    }
    
    /**
     * @dev Mint special reaction NFT for milestones
     */
    function mintSpecialReaction(
        address fan,
        string memory athleteId,
        string memory athleteName,
        string memory specialReason,
        string memory metadataURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(fan, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        reactions[tokenId] = ReactionData({
            fan: fan,
            athleteId: athleteId,
            athleteName: athleteName,
            reactionType: ReactionType.KING, // Special reactions get highest tier
            supportAmount: 0,
            commentary: specialReason,
            timestamp: block.timestamp,
            metadataURI: metadataURI,
            isSpecial: true
        });
        
        fanReactions[fan].push(tokenId);
        athleteReactions[athleteId].push(tokenId);
        
        emit SpecialReactionMinted(tokenId, fan, specialReason);
        
        return tokenId;
    }
    
    /**
     * @dev Get all reaction NFTs owned by a fan
     */
    function getFanReactions(address fan) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return fanReactions[fan];
    }
    
    /**
     * @dev Get all reaction NFTs for an athlete
     */
    function getAthleteReactions(string memory athleteId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return athleteReactions[athleteId];
    }
    
    /**
     * @dev Get reaction data for a token
     */
    function getReactionData(uint256 tokenId) 
        external 
        view 
        returns (ReactionData memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return reactions[tokenId];
    }
    
    /**
     * @dev Get reaction type name and emoji
     */
    function getReactionTypeInfo(ReactionType reactionType) 
        external 
        view 
        returns (string memory name, string memory emoji, uint256 minAmount) 
    {
        ReactionRarity memory rarity = reactionRarities[reactionType];
        return (rarity.name, rarity.emoji, rarity.minAmount);
    }
    
    /**
     * @dev Set FanFuelToken contract address (only owner)
     */
    function setFanFuelTokenAddress(address _fanFuelToken) external onlyOwner {
        require(_fanFuelToken != address(0), "Invalid FanFuelToken address");
        fanFuelToken = _fanFuelToken;
    }
    
    /**
     * @dev Update base metadata URI (only owner)
     */
    function setBaseMetadataURI(string memory _baseMetadataURI) external onlyOwner {
        baseMetadataURI = _baseMetadataURI;
    }
    
    /**
     * @dev Update reaction rarity settings (only owner)
     */
    function updateReactionRarity(
        ReactionType reactionType,
        string memory name,
        uint256 minAmount,
        uint256 tokenMultiplier,
        string memory emoji
    ) external onlyOwner {
        reactionRarities[reactionType] = ReactionRarity({
            name: name,
            minAmount: minAmount,
            tokenMultiplier: tokenMultiplier,
            emoji: emoji
        });
    }
    
    /**
     * @dev Get total number of reactions minted
     */
    function totalReactions() external view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    // Override required by Solidity for ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}