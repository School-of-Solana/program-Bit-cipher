use anchor_lang::prelude::*;
use crate::state::Habit;
use crate::errors::HabitError;

#[derive(Accounts)]
#[instruction(habit_nonce: u8)]
pub struct CheckIn<'info> {
    #[account(
        mut,
        seeds = [
            b"habit",
            owner.key().as_ref(),
            &[habit_nonce]
        ],
        bump = habit.bump,
        has_one = owner
    )]
    pub habit: Account<'info, Habit>,

    pub owner: Signer<'info>,
}

pub fn handler(ctx: Context<CheckIn>, _habit_nonce: u8) -> Result<()> {
    let habit = &mut ctx.accounts.habit;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    // Cooldown: allow first check-in when last_check_in == 0
    if habit.last_check_in != 0 {
        let elapsed = now - habit.last_check_in;
        require!(elapsed >= Habit::COOLDOWN_SECONDS, HabitError::CooldownNotElapsed);
    }

    // increment safely
    habit.count = habit.count.checked_add(1).ok_or(HabitError::CounterOverflow)?;
    habit.last_check_in = now;

    // update simple streak flags
    if habit.count >= 7 {
        habit.streak7 = true;
    }
    if habit.count >= 30 {
        habit.streak30 = true;
    }

    msg!("Checked in '{}' — total: {}", habit.name, habit.count);
    Ok(())
}
