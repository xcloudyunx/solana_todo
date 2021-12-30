import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletMultiButton, WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import App from "./App"

const wallets = [ getPhantomWallet() ];

function AppWithProvider() {
    return (
        <ConnectionProvider endpoint="http://localhost:8899">
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <App />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default AppWithProvider;