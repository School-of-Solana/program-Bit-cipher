# Project Description

**Deployed Frontend URL:** https://habit-tracker-frontend-rho.vercel.app/

**Solana Program ID:** BhiBkgLcMxZFa2MWXrRX4zd6zCbt2k9YKsRYGwzK6ZzM

## Project Overview

### Description

The Habit Tracker is a decentralized application (dApp) built on Solana using the Anchor framework. Its core purpose is to provide users with a verifiable, immutable record of their commitment to daily habits. Every successful check-in results in a signed transaction that permanently records the streak count and the timestamp of the last activity. The program enforces a strict 24-hour cooldown period between check-ins to ensure genuine daily consistency.

### Key Features

- **Immutable Streak Tracking**: All habit accounts and check-in history are stored on-chain in secure PDAs.

- **Enforced Cooldown**: The program uses the Solana clock to enforce a strict 24-hour (86,400 seconds) cooldown, preventing immediate duplicate check-ins.

- **Unique Habit Creation**: Users can create multiple distinct habits, each tied to a unique Program Derived Address (PDA).

- **Streak Badges**: Tracks and records 7-day and 30-day streak achievements directly on the Habit account state.

- **Responsive Frontend**: A clean React interface for easy habit creation, monitoring, and check-ins.

### How to Use the dApp

1. **Connect Wallet** - Connect your Solana wallet (Phantom or Solflare) to the dApp.

2. **Create Habit** - Navigate to the "Create Habit" tab, enter a name, and click "Create Habit." The application selects a random nonce to generate a unique on-chain account.

3. **Check In** - Navigate to the "My Habits" tab. Click the "Check In Now" button for an available habit. This sends a transaction to increment your streak count.

4. **Cooldown** - After a successful check-in, the button will change to "Come Back Tomorrow" and display the remaining time until the 24-hour cooldown elapses.

## Program Architecture

The program leverages PDAs for state security and focuses on two primary instructions to manage the habit lifecycle.

### PDA Usage

The program uses Program Derived Addresses (PDAs) for the Habit account. This is essential for:

Allowing the program to manage the account's life cycle.

Allowing a single owner to create multiple, distinct, deterministic habit accounts.

**PDAs Used:**

Habit PDA: Derived from seeds ["habit", owner_wallet_pubkey, habit_nonce (u8)]. The u8 nonce ensures that the PDA key for "Morning Run" is different from "Reading."

### Program Instructions

**Instructions Implemented:**

- **create_habit(name: String, habit_nonce: u8)**: Initializes a new Habit PDA account, setting the owner, name, and initial values (count = 0, last_check_in = 0).

- **Validation**: Enforces NameTooLong constraint (max 40 bytes).

- **check_in(habit_nonce: u8)**: Increments the count field and updates last_check_in to the current Solana clock timestamp.

- **Validation**: Enforces the 24-hour cooldown by throwing CooldownNotElapsed if the required time has not passed since last_check_in. Also verifies the signer is the account owner via has_one.

### Account Structure

```rust
#[account]
pub struct Habit {
    pub owner: Pubkey,        // The public key of the user who owns the habit.
    pub name: String,         // The descriptive name of the habit (Max 40 bytes).
    pub count: u64,           // The current consecutive check-in streak length.
    pub last_check_in: i64,   // Unix timestamp (seconds) of the last successful check-in.
    pub created_at: i64,      // Unix timestamp when habit was created.
    pub bump: u8,             // The bump seed for PDA verification.
    pub streak7: bool,        // Flag: True if count >= 7.
    pub streak30: bool,       // Flag: True if count >= 30.
}
```

## Testing

### Test Coverage

A comprehensive TypeScript test suite was developed to cover all instructions under both typical (happy) and error-inducing (unhappy) conditions, ensuring program security and reliability.

**Happy Path Tests:**

- Create Habit: Successfully initializes a new PDA account and verifies initial state (count = 0).
- Check In: Successfully increments the streak count from 0 to 1 and updates the last_check_in timestamp to a non-zero value.

**Unhappy Path Tests:**

- Name Too Long: Fails the create_habit instruction by passing a string longer than 40 bytes, correctly triggering the custom NameTooLong error.

- Cooldown Not Elapsed: Fails the check_in instruction by attempting a second check-in immediately after the first, correctly triggering the custom CooldownNotElapsed error.

### Running Tests

```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

This dApp demonstrates robust state validation by implementing a time-based constraint directly in the program, which was a core learning goal. The use of a random u8 nonce combined with the owner's Pubkey ensures flexible and secure PDA creation for multiple user accounts.

Future Scope & Architectural Potential

The current architecture is solid for tracking streaks, but its potential can be greatly expanded. Future features could include:

Rewards and Token Gating (DeFi Integration): Implementing a staking mechanism where users deposit a small amount of SPL tokens upon creating a habit. Failed check-ins (breaking the streak) or success could trigger different token logic.

Withdrawal Feature: Adding a close_habit instruction that allows the user to cash out or recover staked SOL (minus rent) when they complete or abandon a habit. This would require passing the System Program to the instruction to perform the transfer back to the owner.

Social Proof/Sharing: Using a master configuration PDA to store a list of all successful 30-day streak accounts, allowing others to verify and view top achievers publicly.
