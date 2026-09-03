const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Limit Break protocol", () => {
  async function deployProtocol() {
    const [owner, treasury, player, relayer] = await ethers.getSigners();

    const Forwarder = await ethers.getContractFactory("LimitBreakForwarder");
    const forwarder = await Forwarder.deploy();

    const BETToken = await ethers.getContractFactory("BETToken");
    const bet = await BETToken.deploy(treasury.address, owner.address);

    const Staking = await ethers.getContractFactory("LimitBreakStaking");
    const staking = await Staking.deploy(
      await bet.getAddress(),
      await forwarder.getAddress(),
      owner.address
    );

    const NFT = await ethers.getContractFactory("LimitBreakNFT");
    const nft = await NFT.deploy(
      await bet.getAddress(),
      owner.address,
      treasury.address,
      ethers.parseEther("100"),
      10_000
    );

    await bet.connect(treasury).transfer(player.address, ethers.parseEther("10000"));
    await bet.connect(treasury).approve(await staking.getAddress(), ethers.parseEther("1000000"));
    await staking.connect(treasury).fundRewards(ethers.parseEther("1000000"));

    const Registry = await ethers.getContractFactory("LimitBreakPlayerRegistry");
    const registry = await Registry.deploy(owner.address);

    const Achievements = await ethers.getContractFactory("LimitBreakAchievements");
    const achievements = await Achievements.deploy(await registry.getAddress(), owner.address);

    const QuestBoard = await ethers.getContractFactory("LimitBreakQuestBoard");
    const quests = await QuestBoard.deploy(
      await bet.getAddress(),
      await registry.getAddress(),
      owner.address
    );
    await registry.setOperator(await quests.getAddress(), true);

    const Season = await ethers.getContractFactory("LimitBreakSeason");
    const season = await Season.deploy(await bet.getAddress(), owner.address);

    return { owner, treasury, player, relayer, forwarder, bet, staking, nft, registry, achievements, quests, season };
  }

  it("mints the full BET cap and exposes the ticker", async () => {
    const { bet } = await deployProtocol();
    expect(await bet.symbol()).to.equal("BET");
    expect(await bet.totalSupply()).to.equal(ethers.parseEther("1000000000"));
  });

  it("stakes into the conservative pool and accrues rewards after time", async () => {
    const { player, bet, staking } = await deployProtocol();
    const amount = ethers.parseEther("1000");
    await bet.connect(player).approve(await staking.getAddress(), amount);
    await staking.connect(player).stake(0, amount);

    await time.increase(30 * 24 * 60 * 60);

    const pending = await staking.pendingRewards(0);
    expect(pending).to.be.gt(0);

    await staking.connect(player).unstake(0);
    expect(await bet.balanceOf(player.address)).to.be.gt(ethers.parseEther("9000"));
  });

  it("rejects unstake before the lock expires", async () => {
    const { player, bet, staking } = await deployProtocol();
    const amount = ethers.parseEther("100");
    await bet.connect(player).approve(await staking.getAddress(), amount);
    await staking.connect(player).stake(1, amount);
    await expect(staking.connect(player).unstake(0)).to.be.revertedWith("STAKE: locked");
  });

  it("mints an NFT against BET payment", async () => {
    const { player, treasury, bet, nft } = await deployProtocol();
    await bet.connect(player).approve(await nft.getAddress(), ethers.parseEther("100"));
    await nft.connect(player).mint("ipfs://limitbreak/1");
    expect(await nft.ownerOf(1)).to.equal(player.address);
    expect(await nft.tokenURI(1)).to.equal("ipfs://limitbreak/1");
    expect(await bet.balanceOf(treasury.address)).to.equal(
      ethers.parseEther("998990100")
    );
  });

  it("registers a player and records a match", async () => {
    const { player, registry } = await deployProtocol();
    const handle = ethers.encodeBytes32String("ace");
    await registry.connect(player).register(handle);
    expect(await registry.isRegistered(player.address)).to.equal(true);
    await registry.recordMatch(player.address, true, 12);
    const profile = await registry.profiles(player.address);
    expect(profile.wins).to.equal(1);
    expect(profile.reputation).to.be.gt(100);
  });

  it("pays a quest reward after registration", async () => {
    const { owner, treasury, player, bet, registry, quests } = await deployProtocol();
    await registry.connect(player).register(ethers.encodeBytes32String("questor"));
    const questId = ethers.encodeBytes32String("first-clear");
    await quests.defineQuest(questId, ethers.parseEther("50"), 500);
    await bet.connect(treasury).approve(await quests.getAddress(), ethers.parseEther("50"));
    await quests.connect(treasury).fund(ethers.parseEther("50"));
    await quests.connect(owner).completeQuest(player.address, questId);
    expect(await quests.completed(player.address, questId)).to.equal(true);
  });

  it("settles a season prize pool to the champion", async () => {
    const { treasury, player, bet, season } = await deployProtocol();
    const now = BigInt((await ethers.provider.getBlock("latest")).timestamp);
    await season.openSeason(now, now + 10n);
    await bet.connect(treasury).approve(await season.getAddress(), ethers.parseEther("200"));
    await season.connect(treasury).fundSeason(1, ethers.parseEther("200"));
    await time.increase(11);
    await season.settle(1, player.address);
    const row = await season.seasons(1);
    expect(row.champion).to.equal(player.address);
    expect(row.settled).to.equal(true);
  });
});
