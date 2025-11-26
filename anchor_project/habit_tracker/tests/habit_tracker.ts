import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HabitTracker } from "../target/types/habit_tracker";
import { expect } from "chai";

const randomNonce = Math.floor(Math.random() * 255);
const longNameNonce = randomNonce === 8 ? 9 : 8; // Ensure longNameNonce is different

describe("habit-tracker (local)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HabitTracker as Program<HabitTracker>;

  const happyHabitNonce = randomNonce;
  const owner = provider.wallet.publicKey;

  const habitName = "Morning Run";

  let habitPda: anchor.web3.PublicKey;
  let longNamePda: anchor.web3.PublicKey;

  before(async () => {
    [habitPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("habit"),
        owner.toBuffer(),
        Uint8Array.from([happyHabitNonce]),
      ],
      program.programId
    );

    [longNamePda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("habit"),
        owner.toBuffer(),
        Uint8Array.from([longNameNonce]),
      ],
      program.programId
    );
  });

  it("creates a habit (happy)", async () => {
    await program.methods
      .createHabit(habitName, happyHabitNonce)
      .accounts({
        habit: habitPda,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const acc = await program.account.habit.fetch(habitPda);
    expect(acc.name).to.equal(habitName);
    expect(acc.count.toNumber()).to.equal(0);
  });

  it("fails to create a habit if name is too long (unhappy path)", async () => {
    const longName = "A".repeat(41); // Max length is 40

    try {
      await program.methods
        .createHabit(longName, longNameNonce)
        .accounts({
          habit: longNamePda,
          owner: owner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Expected NameTooLong error");
    } catch (err) {
      const s = err.toString();
      expect(s).to.include("NameTooLong");
    }
  });

  it("checks in successfully (happy path)", async () => {
    await program.methods
      .checkIn(happyHabitNonce)
      .accounts({
        habit: habitPda,
        owner: owner,
      })
      .rpc();

    const acc = await program.account.habit.fetch(habitPda);
    expect(acc.count.toNumber()).to.equal(1);
    expect(acc.lastCheckIn.toNumber()).to.be.greaterThan(0);
  });

  it("fails to check in again immediately (unhappy path - cooldown)", async () => {
    try {
      await program.methods
        .checkIn(happyHabitNonce)
        .accounts({
          habit: habitPda,
          owner: owner,
        })
        .rpc();
      expect.fail("Expected cooldown error");
    } catch (err) {
      const s = err.toString();
      expect(s).to.include("CooldownNotElapsed");
    }
  });
});
