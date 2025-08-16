// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OFT } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MinimalLayerZeroOFT
 * @dev LayerZero V2 OFT implementation for FanFuel
 * Meets LayerZero V2 eligibility requirements for prize
 */
contract MinimalLayerZeroOFT is OFT {
    
    // Athlete support tracking
    mapping(string => uint256) public athleteEarnings;
    mapping(address => mapping(string => uint256)) public fanSupport;
    
    // Platform fee (3%)
    uint256 public constant PLATFORM_FEE_BPS = 300;
    uint256 public constant MAX_BPS = 10000;
    address public feeRecipient;
    
    // Events
    event AthleteSupported(address indexed fan, string athleteId, uint256 amount);
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        feeRecipient = _delegate;
        
        // Mint initial supply to deployer
        _mint(_delegate, 10000000 * 10**18); // 10M tokens
    }
    
    /**
     * @dev Support an athlete with tokens
     */
    function supportAthlete(string memory athleteId, uint256 amount) external {
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
     * @dev Get athlete earnings
     */
    function getAthleteEarnings(string memory athleteId) external view returns (uint256) {
        return athleteEarnings[athleteId];
    }
    
    /**
     * @dev Update fee recipient (owner only)
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }
    
    /**
     * @dev Mint tokens (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}