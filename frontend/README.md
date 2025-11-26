Habit Tracker Frontend (React)

This directory contains the user interface for the Solana Habit Tracker dApp. It is a standard React application that uses the Solana Wallet Adapter to connect to the network and the Anchor client to build and send transactions.

Setup & Running

This project requires Node.js (v18+) and standard npm tools.

Install dependencies:

npm install

Start the local development server:

npm start

The application should open at http://localhost:3000.

Key Components

Component

Responsibility

Data Source

App.js

Manages global state (wallet connection, active tab) and central data fetching (fetchHabits). Lifts state up.

Solana Cluster

Header

Displays logo and the WalletMultiButton.

Local state/Wallet Adapter

StatsCards

Calculates and displays aggregated stats (Total Habits, Longest Streak, Active Today).

habits prop

CreateHabit

Collects habit name, generates a unique nonce (u8), and sends the create_habit transaction.

Local state / Anchor program

HabitCard

Displays streak status and handles the check_in transaction logic, including local cooldown calculation.

habit prop / Anchor program

Interaction Flow

Connect Wallet: User connects using Phantom/Solflare.

Create: User inputs a name, the app finds a random habit_nonce, derives the unique PDA, and sends create_habit.

Display: App.js fetches all habits owned by the wallet using program.account.habit.all() with a filter on the owner's public key.

Check In: User clicks the button; the app re-derives the PDA using the stored habit nonce and sends the check_in transaction. A successful transaction triggers a data refresh.
