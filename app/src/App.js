import "./App.css";
import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";

import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [ getPhantomWallet() ];

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

  async function add() {
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

  if (!wallet.connected) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <WalletMultiButton />
      </div>
    );
  } else {
    return (
      <div className="App">
        <div>
          {
            !initialised && (<button onClick={initialise}>Initialise</button>)
          }
          {
            initialised ? (
              <div>
                <input
                  placeholder="Add new task"
                  onChange={e => setInput(e.target.value)}
                  value={input}
                />
                <button onClick={add}>Add task</button>
              </div>
            ) : (
              <h3>Please initialise.</h3>
            )
          }
          {
            todoList.map((d, i) => <h4 key={i} onClick={() => complete(i)}>{d}</h4>)
          }
          {
            completedList.map((d, i) => <h5 key={i}>{d}</h5>)
          }
        </div>
      </div>
    );
  }
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://localhost:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;