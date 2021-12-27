const assert = require("assert");
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('solana_todo', () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaTodo;

  it("Initialise", async () => {
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialise({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("initialised successfully");
    assert.ok(account.todoList.length === 0);
    assert.ok(account.completedList.length === 0);
    _baseAccount = baseAccount;
  });

  it ("Add task", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.add("task one", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("added task: ", account.todoList.at(-1));
    assert.ok(account.todoList.at(-1) === "task one");
    assert.ok(account.todoList.length === 1);
    assert.ok(account.completedList.length === 0);
  });

  it ("Add task 2", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.add("task two", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("added task: ", account.todoList.at(-1));
    assert.ok(account.todoList.at(-1) === "task two");
    assert.ok(account.todoList.length === 2);
    assert.ok(account.completedList.length === 0);
  });

  it ("Complete task", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.complete(1, {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("completed task: ", account.completedList.at(-1));
    assert.ok(account.completedList.at(-1) === "task two");
    assert.ok(account.todoList.length === 1);
    assert.ok(account.completedList.length === 1);
  });

  it ("Remove task", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.remove(0, {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("deleted succesfully");
    assert.ok(account.todoList.length === 0);
    assert.ok(account.completedList.length === 1);
  });
});
