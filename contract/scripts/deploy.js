const hre = require("hardhat");

async function main() {
  console.log("Deploying Study contract to Base network...");

  const Study = await hre.ethers.getContractFactory("Study");
  const study = await Study.deploy();

  await study.waitForDeployment();

  const address = await study.getAddress();
  console.log("Study contract deployed to:", address);
  console.log("Entry fee:", await study.entryFee());

  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network base ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
