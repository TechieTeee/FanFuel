// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FanFuelToken
 * @dev Chiliz-native ERC20 token for individual athlete support on SportFi infrastructure
 * Implements secure fan-to-athlete payment mechanism with automatic revenue splitting
 */
contract FanFuelToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    
    // Athlete information stored on-chain
    struct AthleteInfo {
        string name;
        string sport;
        string university;
        string position;
        uint256 totalEarnings;
        uint256 fanCount;
        bool isActive;
    }
    
    // Fan support transaction record
    struct SupportTransaction {
        address fan;
        uint256 amount;
        uint256 athleteShare;
        uint256 platformFee;
        uint256 timestamp;
        string reactionType;
    }
    
    AthleteInfo public athleteInfo;
    address public athleteWallet;
    address public platformWallet;
    
    uint256 public constant ATHLETE_SHARE_PERCENTAGE = 80; // 80% to athlete
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 20; // 20% platform fee
    uint256 public constant PERCENTAGE_BASE = 100;
    
    uint256 public totalSupported;
    uint256 public totalFanSupport;
    
    mapping(address => uint256) public fanContributions;
    mapping(address => uint256) public fanTokensEarned;
    SupportTransaction[] public supportHistory;
    
    // Events for SportFi ecosystem integration
    event AthleteSupported(
        address indexed fan,
        uint256 amount,
        uint256 athleteShare,
        uint256 platformFee,
        string reactionType
    );
    
    event TokensEarned(
        address indexed fan,
        uint256 tokensEarned,
        uint256 supportAmount
    );
    
    event AthleteInfoUpdated(
        string name,
        string sport,
        string university
    );
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _athleteWallet,
        address _platformWallet,
        string memory _athleteName,
        string memory _sport,
        string memory _university,
        string memory _position
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_athleteWallet != address(0), "Invalid athlete wallet");
        require(_platformWallet != address(0), "Invalid platform wallet");
        
        athleteWallet = _athleteWallet;
        platformWallet = _platformWallet;
        
        athleteInfo = AthleteInfo({
            name: _athleteName,
            sport: _sport,
            university: _university,
            position: _position,
            totalEarnings: 0,
            fanCount: 0,
            isActive: true
        });
        
        // Mint initial supply to contract for distribution
        _mint(address(this), 1000000 * 10**decimals());
    }
    
    /**
     * @dev Support athlete with CHZ payment and earn athlete tokens
     * @param reactionType Type of fan reaction (fire, gem, legend, etc.)
     */
    function supportAthlete(string memory reactionType) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(msg.value > 0, "Support amount must be greater than 0");
        require(athleteInfo.isActive, "Athlete is not active");
        
        uint256 athleteShare = (msg.value * ATHLETE_SHARE_PERCENTAGE) / PERCENTAGE_BASE;
        uint256 platformFee = msg.value - athleteShare;
        
        // Transfer CHZ to athlete and platform
        (bool athleteSuccess, ) = athleteWallet.call{value: athleteShare}("");
        require(athleteSuccess, "Athlete payment failed");
        
        (bool platformSuccess, ) = platformWallet.call{value: platformFee}("");
        require(platformSuccess, "Platform payment failed");
        
        // Calculate tokens to award (1 token per 0.001 CHZ supported)
        uint256 tokensToAward = (msg.value * 1000) / (10**decimals());
        require(balanceOf(address(this)) >= tokensToAward, "Insufficient tokens in contract");
        
        // Transfer athlete tokens to fan
        _transfer(address(this), msg.sender, tokensToAward);
        
        // Update tracking
        fanContributions[msg.sender] += msg.value;
        fanTokensEarned[msg.sender] += tokensToAward;
        totalSupported += msg.value;
        totalFanSupport += msg.value;
        athleteInfo.totalEarnings += athleteShare;
        
        // Update fan count if new supporter
        if (fanContributions[msg.sender] == msg.value) {
            athleteInfo.fanCount++;
        }
        
        // Record transaction
        supportHistory.push(SupportTransaction({
            fan: msg.sender,
            amount: msg.value,
            athleteShare: athleteShare,
            platformFee: platformFee,
            timestamp: block.timestamp,
            reactionType: reactionType
        }));
        
        emit AthleteSupported(msg.sender, msg.value, athleteShare, platformFee, reactionType);
        emit TokensEarned(msg.sender, tokensToAward, msg.value);
    }
    
    /**
     * @dev Get fan's total contribution and tokens earned
     */
    function getFanStats(address fan) external view returns (
        uint256 totalContributed,
        uint256 tokensEarned,
        uint256 supportCount
    ) {
        totalContributed = fanContributions[fan];
        tokensEarned = fanTokensEarned[fan];
        
        // Count support transactions
        supportCount = 0;
        for (uint256 i = 0; i < supportHistory.length; i++) {
            if (supportHistory[i].fan == fan) {
                supportCount++;
            }
        }
    }
    
    /**
     * @dev Get athlete's current stats
     */
    function getAthleteStats() external view returns (
        uint256 totalEarnings,
        uint256 fanCount,
        uint256 totalSupported,
        uint256 transactionCount
    ) {
        return (
            athleteInfo.totalEarnings,
            athleteInfo.fanCount,
            totalSupported,
            supportHistory.length
        );
    }
    
    /**
     * @dev Get recent support transactions
     */
    function getRecentSupport(uint256 count) 
        external 
        view 
        returns (SupportTransaction[] memory) 
    {
        uint256 start = supportHistory.length > count ? supportHistory.length - count : 0;
        uint256 length = supportHistory.length - start;
        
        SupportTransaction[] memory recent = new SupportTransaction[](length);
        for (uint256 i = 0; i < length; i++) {
            recent[i] = supportHistory[start + i];
        }
        
        return recent;
    }
    
    /**
     * @dev Update athlete information (only owner)
     */
    function updateAthleteInfo(
        string memory _name,
        string memory _sport,
        string memory _university,
        string memory _position
    ) external onlyOwner {
        athleteInfo.name = _name;
        athleteInfo.sport = _sport;
        athleteInfo.university = _university;
        athleteInfo.position = _position;
        
        emit AthleteInfoUpdated(_name, _sport, _university);
    }
    
    /**
     * @dev Toggle athlete active status (only owner)
     */
    function setAthleteActive(bool _isActive) external onlyOwner {
        athleteInfo.isActive = _isActive;
    }
    
    /**
     * @dev Update athlete wallet address (only owner)
     */
    function updateAthleteWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        athleteWallet = _newWallet;
    }
    
    /**
     * @dev Emergency pause (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Resume operations (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw any remaining CHZ (only owner, emergency)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No CHZ to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}