use anchor_lang::prelude::*;

pub mod state;
pub mod errors;
pub mod instructions;

use instructions::*;

declare_id!("BhiBkgLcMxZFa2MWXrRX4zd6zCbt2k9YKsRYGwzK6ZzM");

#[program]
pub mod habit_tracker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

     pub fn create_habit(ctx: Context<CreateHabit>, name: String, habit_nonce: u8) -> Result<()> {
        instructions::create::handler(ctx, name, habit_nonce)
    }

    pub fn check_in(ctx: Context<CheckIn>, habit_nonce: u8) -> Result<()> {
        instructions::checkin::handler(ctx, habit_nonce)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
