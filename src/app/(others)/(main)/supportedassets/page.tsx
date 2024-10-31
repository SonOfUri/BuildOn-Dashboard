"use client"

// pages/supported-tokens.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Token {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_active: boolean;
    logo: string;
    description: string;
    platform: string;
    contracts: Array<{ contract: string; platform: string; type: string }> | null;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    price: number;
    volume_24h: number;
    market_cap: number;
}

const tokenIds = ["eth-ethereum", "usdt-tether", "weth-weth", "usdc-usd-coin", "dai-dai"];

const SupportedTokens = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedToken, setExpandedToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokenData = async (tokenId: string) => {
            try {
                const config = { headers: { "Content-Type": "application/json" } };
                const [detailsResponse, tickerResponse] = await Promise.all([
                    axios.get(
                        `https://wild-polished-rain.base-mainnet.quiknode.pro/3496391ea8d4c365f47da27103d79e7c4894c245/addon/748/v1/coins/${tokenId}`,
                        config
                    ),
                    axios.get(
                        `https://wild-polished-rain.base-mainnet.quiknode.pro/3496391ea8d4c365f47da27103d79e7c4894c245/addon/748/v1/tickers/${tokenId}`,
                        config
                    ),
                ]);

                return {
                    ...detailsResponse.data,
                    circulating_supply: tickerResponse.data.circulating_supply,
                    total_supply: tickerResponse.data.total_supply,
                    max_supply: tickerResponse.data.max_supply,
                    price: tickerResponse.data.quotes.USD.price,
                    volume_24h: tickerResponse.data.quotes.USD.volume_24h,
                    market_cap: tickerResponse.data.quotes.USD.market_cap,
                };
            } catch (error) {
                console.error("Error fetching token data:", error);
                return null;
            }
        };

        const fetchAllTokens = async () => {
            setLoading(true);
            const tokenDataPromises = tokenIds.map((id) => fetchTokenData(id));
            const results = await Promise.all(tokenDataPromises);
            setTokens(results.filter((result) => result !== null) as Token[]);
            setLoading(false);
        };

        fetchAllTokens();
    }, []);

    const toggleExpand = (tokenId: string) => {
        setExpandedToken(expandedToken === tokenId ? null : tokenId);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-center text-white">Supported Collateral Assets</h1>
            <div className="space-y-4">
                {tokens.map((token) => (
                    <div
                        key={token.id}
                        className="bg-black text-white border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out"
                    >
                        <button
                            onClick={() => toggleExpand(token.id)}
                            className="flex items-center justify-between w-full text-left focus:outline-none"
                        >
                            <div className="flex items-center space-x-4">
                                <img src={token.logo} alt={token.name} className="w-12 h-12 rounded-full border" />
                                <div>
                                    <h2 className="text-2xl font-semibold">{token.name}</h2>
                                    <p className="text-gray-400">{token.symbol}</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold">{expandedToken === token.id ? "-" : "+"}</span>
                        </button>
                        {expandedToken === token.id && (
                            <div className="mt-4 bg-gray-900 p-4 rounded-lg text-sm">
                                <p className="text-gray-300 mb-2">{token.description}</p>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Platform:</span>
                                    {/* <span>{token.platform}</span> */}
                                    <span>base-base</span>

                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="cursor-pointer underline decoration-dotted"
                                        onClick={() => token.price && copyToClipboard(token.price.toFixed(2))}
                                    >
                                        ${token.price ? token.price.toFixed(2) : "N/A"}
                                    </span>

                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Market Cap:</span>
                                    <span>${token.market_cap.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">24h Volume:</span>
                                    <span>${token.volume_24h.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Circulating Supply:</span>
                                    <span>{token.circulating_supply.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Total Supply:</span>
                                    <span>{token.total_supply.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Max Supply:</span>
                                    <span>{token.max_supply ? token.max_supply.toLocaleString() : "N/A"}</span>
                                </div>

                                <h3 className="text-lg font-semibold mt-4">Contracts</h3>
                                {token.contracts && token.contracts.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 mt-2">
                                        {token.contracts.map((contract) => (
                                            <li key={contract.contract} className="flex items-center justify-between">
                                                <span>
                                                    {contract.platform} ({contract.type}):
                                                </span>
                                                <span
                                                    className="text-blue-400 cursor-pointer underline decoration-dotted"
                                                    onClick={() => copyToClipboard(contract.contract)}
                                                >
                                                    {contract.contract}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">Nill</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupportedTokens;
