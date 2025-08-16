const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FanFuelToken", function () {
  let fanFuelToken;
  let reactionNFT;
  let owner;
  let athlete;
  let platform;
  let fan1;
  let fan2;

  beforeEach(async function () {
    [owner, athlete, platform, fan1, fan2] = await ethers.getSigners();

    // Deploy ReactionNFT
    const ReactionNFT = await ethers.getContractFactory("ReactionNFT");
    reactionNFT = await ReactionNFT.deploy(
      owner.address,
      "https://fanfuel.app/api/metadata/"
    );

    // Deploy FanFuelToken
    const FanFuelToken = await ethers.getContractFactory("FanFuelToken");
    fanFuelToken = await FanFuelToken.deploy(
      "Sarah Johnson Fan Token",
      "SJBASKET",
      athlete.address,
      platform.address,
      "Sarah Johnson",
      "Basketball", 
      "University of Alabama",
      "Point Guard"
    );
  });

  describe("Deployment", function () {
    it("Should set the right athlete info", async function () {
      const athleteInfo = await fanFuelToken.athleteInfo();
      expect(athleteInfo.name).to.equal("Sarah Johnson");
      expect(athleteInfo.sport).to.equal("Basketball");
      expect(athleteInfo.university).to.equal("University of Alabama");
    });

    it("Should set the right token details", async function () {
      expect(await fanFuelToken.name()).to.equal("Sarah Johnson Fan Token");
      expect(await fanFuelToken.symbol()).to.equal("SJBASKET");
    });
  });

  describe("Athlete Support", function () {
    it("Should allow fans to support athlete with CHZ", async function () {
      const supportAmount = ethers.parseEther("5");
      
      await expect(
        fanFuelToken.connect(fan1).supportAthlete("fire", { value: supportAmount })
      ).to.emit(fanFuelToken, "AthleteSupported");
    });

    it("Should split payments correctly (80% athlete, 20% platform)", async function () {
      const supportAmount = ethers.parseEther("10");
      const expectedAthleteShare = ethers.parseEther("8");
      const expectedPlatformFee = ethers.parseEther("2");

      const athleteBalanceBefore = await ethers.provider.getBalance(athlete.address);
      const platformBalanceBefore = await ethers.provider.getBalance(platform.address);

      await fanFuelToken.connect(fan1).supportAthlete("gem", { value: supportAmount });

      const athleteBalanceAfter = await ethers.provider.getBalance(athlete.address);
      const platformBalanceAfter = await ethers.provider.getBalance(platform.address);

      expect(athleteBalanceAfter - athleteBalanceBefore).to.equal(expectedAthleteShare);
      expect(platformBalanceAfter - platformBalanceBefore).to.equal(expectedPlatformFee);
    });

    it("Should award tokens to fans based on support amount", async function () {
      const supportAmount = ethers.parseEther("1");
      const expectedTokens = ethers.parseEther("1000"); // 1 CHZ = 1000 tokens

      await fanFuelToken.connect(fan1).supportAthlete("clap", { value: supportAmount });

      expect(await fanFuelToken.balanceOf(fan1.address)).to.equal(expectedTokens);
    });

    it("Should update athlete stats correctly", async function () {
      const supportAmount = ethers.parseEther("5");
      
      await fanFuelToken.connect(fan1).supportAthlete("fire", { value: supportAmount });
      
      const [totalEarnings, fanCount, totalSupported, transactionCount] = 
        await fanFuelToken.getAthleteStats();
        
      expect(totalEarnings).to.equal(ethers.parseEther("4")); // 80% of 5
      expect(fanCount).to.equal(1);
      expect(totalSupported).to.equal(supportAmount);
      expect(transactionCount).to.equal(1);
    });
  });

  describe("Fan Stats", function () {
    it("Should track fan contributions correctly", async function () {
      const supportAmount1 = ethers.parseEther("3");
      const supportAmount2 = ethers.parseEther("7");

      await fanFuelToken.connect(fan1).supportAthlete("clap", { value: supportAmount1 });
      await fanFuelToken.connect(fan1).supportAthlete("fire", { value: supportAmount2 });

      const [totalContributed, tokensEarned, supportCount] = 
        await fanFuelToken.getFanStats(fan1.address);

      expect(totalContributed).to.equal(supportAmount1 + supportAmount2);
      expect(supportCount).to.equal(2);
    });
  });
});