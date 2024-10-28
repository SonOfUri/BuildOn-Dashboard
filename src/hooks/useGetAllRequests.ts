'use client';
import { getLendbitContract } from '@/config/contracts';
import { readOnlyProvider } from '@/config/provider';
import { Request } from '@/constants/types';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const useGetAllRequests = () => {
    const [requests, setRequests] = useState<{
        loading: boolean;
        data: Request[] | undefined;
    }>({
        loading: true,
        data: [],
    });

    const [filteredReq, setFilteredReq] = useState<{
        loading: boolean;
        data: Request[] | undefined;
    }>({
        loading: true,
        data: [],
    });

    const [myBorrowOrder, setMyBorrowOrder] = useState<{
        loading: boolean;
        data: Request[] | undefined;
    }>({
        loading: true,
        data: [],
    });

    const { address } = useWeb3ModalAccount();


    useEffect(() => {
        (async () => {
            const contract = getLendbitContract(readOnlyProvider);
            let _index = 1;
            const fetchedRequests: Request[] = [];

            while (true) {
                try {
                    const _request = await contract.getRequest(_index);
                    
                    // Check if a valid request is fetched
                    if (_request[0] !== 0) {  
                        const structuredRequest: Request = {
                            requestId: Number(_request[0]),
                            author: _request[1],
                            amount: String(ethers.formatEther(_request[2].toString())),
                            interest: Number(_request[3]),
                            totalRepayment: String(ethers.formatEther(_request[4].toString())),
                            returnDate: Number(_request[5]),
                            lender: _request[6],
                            tokenAddress: _request[7],
                            status: _request[9] == 0 ? 'OPEN' : _request[9] == 1 ? 'SERVICED' : 'CLOSED',
                        };

                        fetchedRequests.push(structuredRequest);
                    } else {
                        break; 
                    }
                    _index += 1;
                } catch (error) {
                    console.error("Error fetching requests:", error);
                    setRequests((prev) => ({ ...prev, loading: false }));
                    break;
                }
            }

            const currentTime = (Date.now());

            // console.log("CURRENT", currentTime);
            

            // Filter the listings based on the given conditions:
            const filteredRequest = fetchedRequests.filter(request => 
                request.status === 'OPEN' &&               // Exclude 'CLOSED' listings
                request.returnDate > currentTime &&             // Exclude listings with expired returnDate
                request.author != address
            );

              // Filter the listings based on the given conditions:
            const myRequest = fetchedRequests.filter(request => 
                request.author == address
            );

            
            // Set the fetched requests and update loading state
            setRequests({
                loading: false,
                data: fetchedRequests,
            });

            setFilteredReq({
                loading: false,
                data: filteredRequest,
            });

            setMyBorrowOrder({
                loading: false,
                data: myRequest,
            });
        })();
    }, [address]);

    return {
        loading: requests.loading,
        requestData: requests.data,
        loading2: filteredReq.loading,
        requestData2: filteredReq.data,
        loading3: myBorrowOrder.loading,
        borrowOrder: myBorrowOrder.data,
    };
};

export default useGetAllRequests;
