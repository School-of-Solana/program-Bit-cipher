Habit Tracker Solana Program (Anchor)

This directory contains the core business logic for the Habit Tracker dApp, written in Rust using the Anchor framework.

Program ID

The Program ID for this deployment is: BhiBkgLcMxZFa2MWXrRX4zd6zCbt2k9YKsRYGwzK6ZzM

Data Structure: The Habit Account

The Habit account is a PDA secured by the program. It stores the user's progress:

Field

Type

Description

owner

Pubkey

The wallet that owns and controls the habit.

name

String

Descriptive name (max 40 chars).

count

u64

The current consecutive check-in streak.

last_check_in

i64

Unix timestamp of the last successful check-in.

bump

u8

The bump seed used for PDA verification.

streak7

bool

True if count >= 7.

streak30

bool

True if count >= 30.

Program Derived Address (PDA)

The PDA is used to uniquely identify and control each habit account. It prevents users from needing to pay rent upfront for the habit account itself, as the program manages its address.

Seeds: ["habit", owner_pubkey, habit_nonce (u8)]

Instructions

1. create_habit

Purpose: Initializes a new, empty Habit account.

Constraints: Checks the name length and initializes streak fields (count, last_check_in) to zero.

2. check_in

Purpose: Increments the streak count and updates the last_check_in timestamp.

Constraints: Enforces the 24-hour cooldown by comparing the current clock timestamp (Clock::get()) against last_check_in.

Testing

Tests cover the critical path: successful creation, successful check-in, and intentional error triggering (unhappy paths) for cooldown violation and name length.

To run tests:

anchor test
