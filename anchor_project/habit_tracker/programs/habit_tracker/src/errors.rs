use anchor_lang::prelude::*;

#[error_code]
pub enum HabitError {
    #[msg("Habit name too long")]
    NameTooLong,
    #[msg("Must wait 24 hours between check-ins")]
    CooldownNotElapsed,
    #[msg("Counter overflow")]
    CounterOverflow,
}
