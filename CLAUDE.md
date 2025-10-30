# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Project Overview

Study DApp is an on-chain learning tracker built on Base. Users connect wallets to track courses with progress bars, store study notes with tags, record achievements with certificate URLs, and set learning goals with target dates.

Entry fee: 0.0000001 ETH per entry.

## Architecture

**Web3 Stack**: Web3ModalProvider (app/context/Web3Modal.jsx) configures Wagmi with Base chain. Contract config in app/contracts/Study.js exports STUDY_ABI and CONTRACT_ADDRESS.

**Smart Contract** (contract/contracts/Study.sol):
- Course: id, owner, title, platform, instructor, progress (0-100), completed, timestamp, exists
- Note: id, owner, title, content, tags, timestamp, exists
- Achievement: id, owner, title, description, certificateUrl, timestamp, exists
- Goal: id, owner, title, description, targetDate, achieved, timestamp, exists

**Key Functions**:
- addCourse() - Payable, stores course with progress
- updateCourseProgress() - Free, updates progress (owner only)
- addNote() - Payable, stores note with tags
- addAchievement() - Payable, stores achievement
- addGoal() - Payable, stores goal with target date
- markGoalAchieved() - Free, marks goal complete (owner only)

**View Functions**: getUserCourses(), getUserNotes(), getUserAchievements(), getUserGoals()

## Components

Each section (Courses, Notes, Achievements, Goals) follows the same pattern: toggle form, submit with writeContract + fee, display in reverse chronological order, auto-refetch on success.

**Special Features**:
- Courses: Progress slider (0-100%), auto-complete at 100%, green theme when done
- Notes: Tag system (comma-separated), purple badges
- Achievements: Golden theme, external certificate links
- Goals: Target dates, overdue detection (red theme), achieved marking (green theme)

## Development

**Frontend**: `pnpm dev` (localhost:3000), `pnpm build`, `pnpm start`
**Contract**: `cd contract && npx hardhat compile && npx hardhat run scripts/deploy.js --network base`

**Environment**: NEXT_PUBLIC_PROJECT_ID (WalletConnect), PRIVATE_KEY + BASESCAN_API_KEY (contract deployment)

## Constraints

- Base mainnet only (chainId 8453)
- Entry fee: 0.0000001 ETH
- No editing (permanent on-chain)
- Dark mode only (purple theme)
- Progress updates and goal marking are free (no fee)
