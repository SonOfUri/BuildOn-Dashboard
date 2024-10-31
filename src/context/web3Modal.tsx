'use client'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

export const SUPPORTED_CHAIN_ID = 8453;
// 8452



const projectId = process.env.NEXT_PUBLIC_PROJECT_ID


const base = {
    chainId: SUPPORTED_CHAIN_ID,
    name: 'Base Mainnet',
    currency: 'ETH',
    explorerUrl: 'https://basescan.org/',
    rpcUrl: `${process.env.NEXT_PUBLIC_HTTP_RPC}`
}

const metadata = {
    name: 'Lendbit | P2P Lending',
    description: 'Lendbit, Your gateway to seamless peer-to-peer crypto lending & borrowing. Secure, transparent, and flexible. Unlock the full potential of your digital assets.',
    url: 'https://mainnet.lendbit.finance/',
    icons: ['https://mainnet.lendbit.finance/_next/image?url=%2Flogo.png&w=64&q=100']
}

const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: '...', // used for the Coinbase SDK
    defaultChainId: 1 // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [base],
    projectId: `${projectId}`,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
})

export function Web3Modal({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
        </div>
    )
}