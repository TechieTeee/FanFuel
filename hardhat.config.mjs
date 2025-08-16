import { config } from 'dotenv';
config({ path: '.env.local' });

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    chiliz: {
      url: process.env.CHILIZ_RPC_URL || "https://spicy-rpc.chiliz.com/",
      accounts: process.env.CHILIZ_PRIVATE_KEY ? [process.env.CHILIZ_PRIVATE_KEY] : [],
      chainId: 88882,
      gasPrice: 'auto'
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};