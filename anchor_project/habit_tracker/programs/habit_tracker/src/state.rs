use anchor_lang::prelude::*;

#[account]
pub struct Habit {
    pub owner: Pubkey,   
    pub name: String,         
    pub count: u64,           
    pub last_check_in: i64,   
    pub created_at: i64,     
    pub bump: u8,             
    pub streak7: bool,        
    pub streak30: bool,       
}

impl Habit {
    pub const MAX_NAME_LENGTH: usize = 40;
    pub const LEN: usize = 8 + 32 + (4 + Self::MAX_NAME_LENGTH) + 8 + 8 + 8 + 1 + 2;
    pub const COOLDOWN_SECONDS: i64 = 86400; 
}
