// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OFT } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FanFuelOFT
 * @dev LayerZero Omnichain Fungible Token for FanFuel platform
 * Enables cross-chain fan token transfers and athlete support payments
 * Built with OpenZeppelin security standards
 */
contract FanFuelOFT is OFT, ReentrancyGuard, Pausable {
    // Events
    event AthleteSupported(address indexed fan, string athleteId, uint256 amount, uint32 srcEid);
    event CrossChainReactionSent(address indexed fan, string reactionType, uint256 amount, uint32 dstEid);
    event ReactionCostUpdated(string reactionType, uint256 oldCost, uint256 newCost);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    // Athlete support tracking
    mapping(string => uint256) public athleteEarnings;
    mapping(address => mapping(string => uint256)) public fanSupport;
    
    // Reaction types and costs (in token units, 18 decimals)
    mapping(string => uint256) public reactionCosts;
    
    // Platform fee (3% as per PRD)
    uint256 public constant PLATFORM_FEE_BPS = 300; // 3%
    uint256 public constant MAX_BPS = 10000;
    
    address public feeRecipient;
    
    // Maximum supply cap for security
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1B tokens
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        address _feeRecipient
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
        
        // Initialize reaction costs (PRD: Clap $2, Fire $5, Gem $10, Strong $15, Legend $25, King $50)
        // Note: These are denominated in tokens, not USD - adjust based on token value
        reactionCosts["clap"] = 2 * 10**18;      // 2 tokens
        reactionCosts["fire"] = 5 * 10**18;      // 5 tokens  
        reactionCosts["gem"] = 10 * 10**18;      // 10 tokens
        reactionCosts["strong"] = 15 * 10**18;   // 15 tokens
        reactionCosts["legend"] = 25 * 10**18;   // 25 tokens
        reactionCosts["king"] = 50 * 10**18;     // 50 tokens
        
        // Mint initial supply to deployer (10M tokens for demo)
        _mint(_delegate, 10000000 * 10**18);
    }

    /**
     * @dev Support an athlete with tokens
     * @param athleteId Unique identifier for the athlete
     * @param amount Amount of tokens to support with
     */
    function supportAthlete(string memory athleteId, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(athleteId).length > 0, "Invalid athlete ID");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate platform fee
        uint256 platformFee = (amount * PLATFORM_FEE_BPS) / MAX_BPS;
        uint256 athleteAmount = amount - platformFee;
        
        // Transfer tokens from sender to this contract
        _transfer(msg.sender, address(this), amount);
        
        // Track earnings (athlete gets net amount after fee)
        athleteEarnings[athleteId] += athleteAmount;
        fanSupport[msg.sender][athleteId] += amount;
        
        // Transfer platform fee to fee recipient
        if (platformFee > 0) {
            _transfer(address(this), feeRecipient, platformFee);
        }
        
        emit AthleteSupported(msg.sender, athleteId, amount, 0);
    }

    /**
     * @dev Send cross-chain reaction support
     * @param athleteId Unique identifier for the athlete
     * @param reactionType Type of reaction (clap, fire, gem, etc.)
     * @param dstEid Destination chain endpoint ID
     * @param to Recipient address on destination chain
     * @param options LayerZero execution options
     * @param fee LayerZero messaging fee
     */
    function sendCrossChainReaction(
        string memory athleteId,
        string memory reactionType,
        uint32 dstEid,
        bytes32 to,
        bytes calldata options,
        MessagingFee calldata fee
    ) external payable nonReentrant whenNotPaused {
        uint256 reactionCost = reactionCosts[reactionType];
        require(reactionCost > 0, "Invalid reaction type");
        require(bytes(athleteId).length > 0, "Invalid athlete ID");
        require(balanceOf(msg.sender) >= reactionCost, "Insufficient balance for reaction");
        require(msg.value >= fee.nativeFee, "Insufficient gas fee");
        
        // Prepare the send parameters
        SendParam memory sendParam = SendParam(
            dstEid,
            to,
            reactionCost,
            reactionCost,
            options,
            abi.encode(athleteId, reactionType, msg.sender),
            ""
        );
        
        // Send the tokens cross-chain
        _lzSend(sendParam, fee, msg.sender);
        
        emit CrossChainReactionSent(msg.sender, reactionType, reactionCost, dstEid);
    }

    /**
     * @dev Handle received cross-chain messages
     * @param _origin Details about the message origin
     * @param _message Encoded message data
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        // Decode the message
        (string memory athleteId, string memory reactionType, address originalSender) = 
            abi.decode(_message, (string, string, address));
        
        // Process the cross-chain reaction
        uint256 reactionCost = reactionCosts[reactionType];
        if (reactionCost > 0 && bytes(athleteId).length > 0) {
            // Calculate platform fee
            uint256 platformFee = (reactionCost * PLATFORM_FEE_BPS) / MAX_BPS;
            uint256 athleteAmount = reactionCost - platformFee;
            
            // Track earnings
            athleteEarnings[athleteId] += athleteAmount;
            fanSupport[originalSender][athleteId] += reactionCost;
            
            // Transfer platform fee to fee recipient
            if (platformFee > 0 && balanceOf(address(this)) >= platformFee) {
                _transfer(address(this), feeRecipient, platformFee);
            }
            
            emit AthleteSupported(originalSender, athleteId, reactionCost, _origin.srcEid);
        }
    }

    /**
     * @dev Update reaction costs (only owner)
     */
    function updateReactionCost(string memory reactionType, uint256 newCost) 
        external 
        onlyOwner 
    {
        require(bytes(reactionType).length > 0, "Invalid reaction type");
        require(newCost > 0, "Cost must be greater than 0");
        
        uint256 oldCost = reactionCosts[reactionType];
        reactionCosts[reactionType] = newCost;
        
        emit ReactionCostUpdated(reactionType, oldCost, newCost);
    }
    
    /**
     * @dev Update fee recipient (only owner)
     */
    function updateFeeRecipient(address newFeeRecipient) external onlyOwner {
        require(newFeeRecipient != address(0), "Invalid fee recipient");
        
        address oldRecipient = feeRecipient;
        feeRecipient = newFeeRecipient;
        
        emit FeeRecipientUpdated(oldRecipient, newFeeRecipient);
    }

    /**
     * @dev Emergency pause (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get athlete's total earnings
     */
    function getAthleteEarnings(string memory athleteId) external view returns (uint256) {
        return athleteEarnings[athleteId];
    }
    
    /**
     * @dev Get fan's support for specific athlete
     */
    function getFanSupport(address fan, string memory athleteId) external view returns (uint256) {
        return fanSupport[fan][athleteId];
    }
    
    /**
     * @dev Get reaction cost for specific type
     */
    function getReactionCost(string memory reactionType) external view returns (uint256) {
        return reactionCosts[reactionType];
    }

    /**
     * @dev Get all supported reaction types with costs
     */
    function getAllReactionCosts() external view returns (
        string[] memory types, 
        uint256[] memory costs
    ) {
        types = new string[](6);
        costs = new uint256[](6);
        
        types[0] = "clap";
        types[1] = "fire";
        types[2] = "gem";
        types[3] = "strong";
        types[4] = "legend";
        types[5] = "king";
        
        for (uint i = 0; i < 6; i++) {
            costs[i] = reactionCosts[types[i]];
        }
    }

    /**
     * @dev Mint tokens (only owner, with supply cap)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        
        _mint(to, amount);
    }

    /**
     * @dev Emergency withdraw function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = balanceOf(address(this));
        if (balance > 0) {
            _transfer(address(this), owner(), balance);
        }
    }

    /**
     * @dev Override _update to add pausable functionality
     */
    function _update(address from, address to, uint256 value) 
        internal 
        virtual 
        override 
        whenNotPaused 
    {
        super._update(from, to, value);
    }
}