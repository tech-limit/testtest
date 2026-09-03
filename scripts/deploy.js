const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;

  console.log("Deployer:", deployer.address);
  console.log("Treasury:", treasury);

  const Forwarder = await ethers.getContractFactory("LimitBreakForwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.waitForDeployment();

  const BETToken = await ethers.getContractFactory("BETToken");
  const bet = await BETToken.deploy(treasury, deployer.address);
  await bet.waitForDeployment();

  const LimitBreakStaking = await ethers.getContractFactory("LimitBreakStaking");
  const staking = await LimitBreakStaking.deploy(
    await bet.getAddress(),
    await forwarder.getAddress(),
    deployer.address
  );
  await staking.waitForDeployment();

  const LimitBreakNFT = await ethers.getContractFactory("LimitBreakNFT");
  const nft = await LimitBreakNFT.deploy(
    await bet.getAddress(),
    deployer.address,
    treasury,
    ethers.parseEther("100"),
    100_000
  );
  await nft.waitForDeployment();

  const LimitBreakPlayerRegistry = await ethers.getContractFactory("LimitBreakPlayerRegistry");
  const registry = await LimitBreakPlayerRegistry.deploy(deployer.address);
  await registry.waitForDeployment();

  const LimitBreakAchievements = await ethers.getContractFactory("LimitBreakAchievements");
  const achievements = await LimitBreakAchievements.deploy(
    await registry.getAddress(),
    deployer.address
  );
  await achievements.waitForDeployment();

  const LimitBreakQuestBoard = await ethers.getContractFactory("LimitBreakQuestBoard");
  const quests = await LimitBreakQuestBoard.deploy(
    await bet.getAddress(),
    await registry.getAddress(),
    deployer.address
  );
  await quests.waitForDeployment();
  await (await registry.setOperator(await quests.getAddress(), true)).wait();

  const LimitBreakSeason = await ethers.getContractFactory("LimitBreakSeason");
  const season = await LimitBreakSeason.deploy(await bet.getAddress(), deployer.address);
  await season.waitForDeployment();

  const rewardFloat = ethers.parseEther("50000000");
  if (treasury.toLowerCase() === deployer.address.toLowerCase()) {
    await (await bet.approve(await staking.getAddress(), rewardFloat)).wait();
    await (await staking.fundRewards(rewardFloat)).wait();
  }

  const deployment = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    treasury,
    contracts: {
      LimitBreakForwarder: await forwarder.getAddress(),
      BETToken: await bet.getAddress(),
      LimitBreakStaking: await staking.getAddress(),
      LimitBreakNFT: await nft.getAddress(),
      LimitBreakPlayerRegistry: await registry.getAddress(),
      LimitBreakAchievements: await achievements.getAddress(),
      LimitBreakQuestBoard: await quests.getAddress(),
      LimitBreakSeason: await season.getAddress(),
    },
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${deployment.chainId}.json`);
  fs.writeFileSync(file, JSON.stringify(deployment, null, 2));
  console.log("Wrote", file);
  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
