// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleFanFuelOFT
 * @dev Simple FanFuel token with LayerZero integration for cross-chain athlete support
 */
contract SimpleFanFuelOFT is ERC20, Ownable, ReentrancyGuard {
    
    // Events
    event AthleteSupported(address indexed fan, string athleteId, uint256 amount);
    event ReactionPurchased(address indexed fan, string reactionType, uint256 cost);
    
    // Athlete earnings tracking
    mapping(string => uint256) public athleteEarnings;
    mapping(address => mapping(string => uint256)) public fanSupport;
    
    // Reaction costs (in token units)
    mapping(string => uint256) public reactionCosts;
    
    // Platform fee (3%)
    uint256 public constant PLATFORM_FEE_BPS = 300;
    uint256 public constant MAX_BPS = 10000;
    
    address public feeRecipient;
    
    constructor(
        address _feeRecipient
    ) ERC20("FanFuel Token", "FUEL") Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
        
        // Initialize reaction costs (PRD: Clap $2, Fire $5, Gem $10, Strong $15, Legend $25, King $50)
        reactionCosts["clap"] = 2 * 10**18;      // 2 tokens
        reactionCosts["fire"] = 5 * 10**18;      // 5 tokens  
        reactionCosts["gem"] = 10 * 10**18;      // 10 tokens
        reactionCosts["strong"] = 15 * 10**18;   // 15 tokens
        reactionCosts["legend"] = 25 * 10**18;   // 25 tokens
        reactionCosts["king"] = 50 * 10**18;     // 50 tokens
        
        // Mint initial supply (10M tokens)
        _mint(msg.sender, 10000000 * 10**18);
    }
    
    /**
     * @dev Support an athlete with tokens
     */
    function supportAthlete(string memory athleteId, uint256 amount) 
        external 
        nonReentrant 
    {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(athleteId).length > 0, "Invalid athlete ID");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate platform fee
        uint256 platformFee = (amount * PLATFORM_FEE_BPS) / MAX_BPS;
        uint256 athleteAmount = amount - platformFee;
        
        // Transfer tokens
        _transfer(msg.sender, address(this), amount);
        
        // Track earnings
        athleteEarnings[athleteId] += athleteAmount;
        fanSupport[msg.sender][athleteId] += amount;
        
        // Send platform fee
        if (platformFee > 0) {
            _transfer(address(this), feeRecipient, platformFee);
        }
        
        emit AthleteSupported(msg.sender, athleteId, amount);
    }
    
    /**
     * @dev Purchase reaction tokens
     */
    function purchaseReaction(string memory reactionType) external {
        uint256 cost = reactionCosts[reactionType];
        require(cost > 0, "Invalid reaction type");
        require(balanceOf(msg.sender) >= cost, "Insufficient balance");
        
        _transfer(msg.sender, address(this), cost);
        
        emit ReactionPurchased(msg.sender, reactionType, cost);
    }
    
    /**
     * @dev Get athlete earnings
     */
    function getAthleteEarnings(string memory athleteId) external view returns (uint256) {
        return athleteEarnings[athleteId];
    }
    
    /**
     * @dev Get reaction cost
     */
    function getReactionCost(string memory reactionType) external view returns (uint256) {
        return reactionCosts[reactionType];
    }
    
    /**
     * @dev Update fee recipient (owner only)
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }
    
    /**
     * @dev Mint more tokens (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}