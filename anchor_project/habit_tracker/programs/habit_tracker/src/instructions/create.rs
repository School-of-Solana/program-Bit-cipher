use anchor_lang::prelude::*;
use crate::state::Habit;
use crate::errors::HabitError;

#[derive(Accounts)]
#[instruction(name: String, habit_nonce: u8)]
pub struct CreateHabit<'info> {
    #[account(
        init,
        payer = owner,
        space = Habit::LEN,
        seeds = [
            b"habit",
            owner.key().as_ref(),
            &[habit_nonce]
        ],
        bump
    )]
    pub habit: Account<'info, Habit>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateHabit>, name: String, _habit_nonce: u8) -> Result<()> {
    require!(name.len() <= Habit::MAX_NAME_LENGTH, HabitError::NameTooLong);

    let habit = &mut ctx.accounts.habit;
    let clock = Clock::get()?;

    habit.owner = ctx.accounts.owner.key();
    habit.name = name;
    habit.count = 0;
    habit.last_check_in = 0;
    habit.created_at = clock.unix_timestamp;
    habit.bump = ctx.bumps.habit;
    habit.streak7 = false;
    habit.streak30 = false;

    msg!("Created habit: {}", habit.name);
    Ok(())
}
