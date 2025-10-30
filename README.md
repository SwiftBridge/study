# Study DApp

Track your learning journey on the blockchain. Store courses, notes, achievements, and learning goals permanently on Base.

## Features

- **Courses**: Track progress with interactive sliders (0-100%)
- **Study Notes**: Store notes with tag system for organization
- **Achievements**: Record certificates and milestones with URLs
- **Learning Goals**: Set target dates and mark as achieved
- **Entry Fee**: Only 0.0000001 ETH per entry
- **Dark Mode**: Purple-themed UI with Tailwind CSS
- **WalletConnect**: Support for all major Web3 wallets

## Tech Stack

- Next.js 15, React 19
- Tailwind CSS (dark mode)
- Wagmi v2, Viem, Web3Modal v5
- Solidity 0.8.27
- Base mainnet
- Hardhat

## Getting Started

### Installation

```bash
git clone https://github.com/winsznx/study.git
cd study
pnpm install
```

### Environment Setup

Create `.env.local`:
```bash
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Smart Contract

### Deploy

```bash
cd contract
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network base
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

Update `app/contracts/Study.js` with deployed address.

## Contract Functions

- `addCourse()` - Add course with progress tracking
- `updateCourseProgress()` - Update course completion (0-100%)
- `addNote()` - Store study notes with tags
- `addAchievement()` - Record certificates and achievements
- `addGoal()` - Set learning goals with target dates
- `markGoalAchieved()` - Mark goal as completed

## License

MIT
