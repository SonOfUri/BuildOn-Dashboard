"use client"

import { getLendbitContract } from "@/config/contracts";
import { readOnlyProvider } from "@/config/provider";
import { Request } from "@/constants/types";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";



const useGetActiveRequest = () => {
  const [activeReq, setActiveReq] = useState<Request[] | null>(null); 
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const contract = getLendbitContract(readOnlyProvider);
        const res = await contract.getUserActiveRequests(address);

        console.log("RESPONSE", res);
        

        const formattedRequests: Request[] = res.map((req: any) => ({
          requestId: Number(req[0]), // Convert BigNumber to number
          author: req[1],
          amount: String(req[2]), // Convert BigNumber to string for amount
          interest: Number(req[3]), // Convert BigNumber to number for interest
          totalRepayment: String(req[4]), // Convert BigNumber to string
          returnDate: Number(req[5]), // Convert BigNumber to number for date
          lender: req[6],
          tokenAddress: req[7], // Assuming you meant tokenAddress from `loanRequestAddr`
          status: String(Number(req[9])) // Map the status to a string representation
        }));

        setActiveReq(formattedRequests);

      } catch (err) {
        console.error(err);
      }
    };

    if (address) {
      fetchUserStatus();
    }
  }, [address]);

  // Function to parse status from the contract's Status enum
  const parseStatus = (status: number): string => {
    switch (status) {
      case 0: return "OPEN";
      case 1: return "SERVICED";
      case 2: return "CLOSED";
      default: return "UNKNOWN";
    }
  };

  return activeReq;
};

export default useGetActiveRequest;
