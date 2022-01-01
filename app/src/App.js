import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";
import { useWallet } from "@solana/wallet-adapter-react";

import AddItem from "./AddItem";
import ToDo from "./ToDo";
import Completed from "./Completed";

import "./App.css";

const { SystemProgram, Keypair } = web3;
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [initialised, setInitialised] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [input, setInput] = useState("");
  
  const wallet = useWallet();

  async function getProvider() {
    const network = "http://localhost:8899";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  async function initialise() {
    const provider = await getProvider();

    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.initialise({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("account: ", account);
      setTodoList(account.todoList);
      setCompletedList(account.completedList);
      setInitialised(true);
    } catch (err) {
      alert("an error occured");
      console.log("Transaction error: ", err);
    }
  }

  async function add(evt) {
    evt.preventDefault();
    if (!input) return;
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.add(input, {
        accounts: {
          baseAccount: baseAccount.publicKey
        }
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("account: ", account);
      setTodoList(account.todoList);
      setCompletedList(account.completedList);
      setInput("");
    } catch (err) {
      alert("an error occured");
      console.log("Transaction error: ", err);
    }
  }

  async function complete(index) {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.complete(index, {
        accounts: {
          baseAccount: baseAccount.publicKey
        }
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("account: ", account);
      setTodoList(account.todoList);
      setCompletedList(account.completedList);
    } catch (err) {
      alert("an error occured");
      console.log("Transaction error: ", err);
    }
  }

  async function remove(index) {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.remove(index, {
        accounts: {
          baseAccount: baseAccount.publicKey
        }
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("account: ", account);
      setTodoList(account.todoList);
      setCompletedList(account.completedList);
    } catch (err) {
      alert("an error occured");
      console.log("Transaction error: ", err);
    }
  }

  return (
    <div>
      {
        wallet.connected && (initialised ? (
          <div className="app">
            <AddItem
              add={add}
              input={input}
              setInput={setInput}
            />
            <ToDo
              complete={complete}
              remove={remove}
              todoList={todoList}
            />
            <Completed
              completedList={completedList}
            />
          </div>
        ) : (
          <div className="app">
            <button onClick={initialise}>Initialise</button>
            <h3>Please initialise.</h3>
          </div>
        ))
      }
    </div>
    );
}

export default App;