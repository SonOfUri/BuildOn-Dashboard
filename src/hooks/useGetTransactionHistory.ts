import { useState, useEffect } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react'; // Replace with actual import if needed
import { envVars } from "@/constants/envVars"; // Replace with actual path if needed
import { Result } from '@/constants/types/interfaces';

const useGetTransactionHistory = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<Result | null>(null);
    const { address } = useWeb3ModalAccount();

    useEffect(() => {
        if (!address) return;

        const fetchTransactionHistory = async () => {
            setIsLoading(true);
            const query_params = { page: "1", size: "1000", fromHeight: "0", details: "txs" };
            const postData = JSON.stringify({
                jsonrpc: "2.0",
                method: "bb_getaddress",
                params: [address, query_params],
                id: 1
            });

            try {
                const response = await fetch(envVars.quicknodeRpc, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: postData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setResult(data?.result);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionHistory();
    }, [address]);

    return { isLoading, result };
};

export default useGetTransactionHistory;
