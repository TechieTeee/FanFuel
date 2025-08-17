# FanFuel - SportFi Commentary-to-Revenue Platform

**Transforming sports commentary into direct athlete revenue using Chiliz Chain, Flow, and LayerZero**

## 🏆 Prize Eligibility - Multi-Chain Integration

### ✅ Live Deployment on Chiliz Spicy Testnet

**Deployment Verification for ETHGlobal Judges:**
- **Network**: Chiliz Spicy Testnet (Chain ID: 88882)
- **Deployer Address**: `0x0AD5C175820d6760996E9496379D83C336d560D1`
- **Test Transaction**: `0xded631a7245d847f71f397963e4dcd33c293d6e03cab4d2f809d98347c889bf9`
- **Explorer**: https://spicy-explorer.chiliz.com/
- **RPC Endpoint**: https://spicy-rpc.chiliz.com/

**Smart Contracts Deployed:**
- **ReactionNFT**: `0xD5aa426E4702860155bAa6E3173C010420fc6326`
- **Sarah Johnson FanFuelToken**: `0xec39e94bb2BDDfba995DF9EB14356657604155E5`
- **Marcus Williams FanFuelToken**: `0xb9b687Bb5447287A3b30b1EDB6c4be112A934073`

### ✅ LayerZero V2 Integration - Sepolia Testnet

**LayerZero V2 Contract Deployment:**
- **Network**: Ethereum Sepolia Testnet (Chain ID: 11155111)
- **Contract Address**: `0xD5aa426E4702860155bAa6E3173C010420fc6326`
- **Token Name**: FanFuel Token (FUEL)
- **LayerZero Endpoint**: `0x6EDCE65403992e310A62460808c4b910D972f10f`
- **Initial Supply**: 10,000,000 FUEL tokens
- **Explorer**: https://sepolia.etherscan.io/address/0xD5aa426E4702860155bAa6E3173C010420fc6326

**LayerZero V2 Features:**
- ✅ **Omnichain Fungible Token (OFT)** standard implementation
- ✅ **Cross-chain messaging** for athlete support
- ✅ **LayerZero V2 protocol** compliance for prize eligibility
- ✅ **Athlete earnings tracking** across multiple chains
- ✅ **Platform fee structure** (3% on all transactions)

### ✅ Flow EVM Integration - Flow EVM Testnet

**Flow EVM Contract Deployment:**
- **Network**: Flow EVM Testnet (Chain ID: 545)
- **Contract Address**: `0xD5aa426E4702860155bAa6E3173C010420fc6326`
- **Token Name**: FanFuel Reaction NFTs (FFNFT)
- **RPC Endpoint**: https://testnet.evm.nodes.onflow.org
- **Explorer**: https://evm-testnet.flowscan.io/address/0xD5aa426E4702860155bAa6E3173C010420fc6326

**Flow EVM Features:**
- ✅ **Consumer-friendly NFT experience** for mainstream adoption
- ✅ **ERC721 standard compliance** with rich metadata
- ✅ **Reaction-based minting** with dynamic pricing tiers
- ✅ **Gas-efficient operations** optimized for Flow EVM
- ✅ **Payable NFT system** with native FLOW token support
- ✅ **Athlete attribution** and support tracking

**NFT Reaction Pricing:**
- 👏 Clap: 0.01 FLOW (~$2 equivalent)
- 🔥 Fire: 0.025 FLOW (~$5 equivalent)
- 💎 Gem: 0.05 FLOW (~$10 equivalent)
- 💪 Strong: 0.075 FLOW (~$15 equivalent)
- 🏆 Legend: 0.125 FLOW (~$25 equivalent)
- 👑 King: 0.25 FLOW (~$50 equivalent)

**Security Features (OpenZeppelin):**
- ReentrancyGuard for safe transactions
- Pausable for emergency controls
- Ownable for access management
- ERC20/ERC721 standard compliance

**SportFi Integration:**
- Native CHZ token support
- 80/20 revenue split (athlete/platform)
- Fan token rewards system
- Reaction-based NFT minting

### 🔍 Deployment Verification

**Contract Explorer Links:**
- [Test Transaction](https://spicy-explorer.chiliz.com/tx/0xded631a7245d847f71f397963e4dcd33c293d6e03cab4d2f809d98347c889bf9)
- [ReactionNFT Contract](https://spicy-explorer.chiliz.com/address/0xD5aa426E4702860155bAa6E3173C010420fc6326)
- [Sarah Johnson Token](https://spicy-explorer.chiliz.com/address/0xec39e94bb2BDDfba995DF9EB14356657604155E5)
- [Marcus Williams Token](https://spicy-explorer.chiliz.com/address/0xb9b687Bb5447287A3b30b1EDB6c4be112A934073)
- [Deployer Account](https://spicy-explorer.chiliz.com/address/0x0AD5C175820d6760996E9496379D83C336d560D1)

**Technical Implementation:**
- OpenZeppelin security standards (ReentrancyGuard, Pausable, Ownable)
- ERC20 athlete tokens with custom support mechanics
- ERC721 reaction NFTs with rarity tiers
- Gamified reaction system: 👏 Clap ($2), 🔥 Fire ($5), 💎 Gem ($10), 💪 Strong ($15), 🏆 Legend ($25), 👑 King ($50)

**Prize Eligibility Checklist:**
- ✅ Real smart contracts deployed to Chiliz Spicy Testnet
- ✅ Transaction hash and explorer verification available
- ✅ OpenZeppelin security implementation
- ✅ SportFi-focused athlete tokenization
- ✅ Working integration with Next.js frontend
- ✅ RainbowKit wallet connection with Chiliz Chain support

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
