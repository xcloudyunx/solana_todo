use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_todo {
    use super::*;

    pub fn initialise(ctx: Context<Initialise>) -> ProgramResult {
        Ok(())
    }

    pub fn add(ctx: Context<Update>, data: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.todo_list.push(data);
        Ok(())
    }

    pub fn delete(ctx: Context<Update>, index: u8) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.todo_list.remove(index as usize);
        Ok(())
    }

    pub fn complete(ctx: Context<Update>, index: u8) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let copy = base_account.todo_list[index as usize].clone();
        base_account.completed_list.push(copy);
        base_account.todo_list.remove(index as usize);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialise<'info> {
    #[account(init, payer=user, space=128+128)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub todo_list: Vec<String>,
    pub completed_list: Vec<String>,
}
