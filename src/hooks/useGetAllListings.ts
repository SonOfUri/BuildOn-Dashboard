'use client';
import { getLendbitContract } from '@/config/contracts';
import { readOnlyProvider } from '@/config/provider';
import { LoanListing } from '@/constants/types';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const useGetAllListings = () => {
    const [listings, setListings] = useState<{
        loadings: boolean;
        data: LoanListing[] | undefined;
    }>({
        loadings: true,
        data: [],
    });

    const [filteredListings, setFilteredListings] = useState<{
        loadings: boolean;
        data: LoanListing[] | undefined;
    }>({
        loadings: true,
        data: [],
    });

    const [myLendOrder, setMyLendOrder] = useState<{
        loadings: boolean;
        data: LoanListing[] | undefined;
    }>({
        loadings: true,
        data: [],
    });

    const { address } = useWeb3ModalAccount();


    useEffect(() => {
        (async () => {
            const contract = getLendbitContract(readOnlyProvider);
            let _index = 1;
            const fetchedListings: LoanListing[] = [];

            while (true) {
                try {
                    const _listing = await contract.getLoanListing(_index);
                    
                    // Check if a valid listing is fetched
                    if (_listing[0] !== 0) {  
                        const structuredListing: LoanListing = {
                            listingId: Number(_listing[0]),
                            author: _listing[1],
                            tokenAddress: _listing[2],
                            amount: String(ethers.formatEther(_listing[3].toString())),
                            min_amount: String(ethers.formatEther(_listing[4].toString())),
                            max_amount: String(ethers.formatEther(_listing[5].toString())),
                            returnDate: Number(_listing[6]), // Unix timestamp
                            interest: Number(_listing[7]),
                            status: _listing[8] == 0 ? 'OPEN' : 'CLOSED',
                        };

                        fetchedListings.push(structuredListing);
                    } else {
                        break; 
                    }
                    _index += 1;
                } catch (error) {
                    console.error("Error fetching loan listings:", error);
                    setListings((prev) => ({ ...prev, loadings: false }));
                    break;
                }
            }

            // Get current Unix timestamp
            const currentTime = (Date.now());
            

            // Filter the listings based on the given conditions:
            const filteredList = fetchedListings.filter(listing => 
                listing.status === 'OPEN' &&               // Exclude 'CLOSED' listings
                listing.returnDate > currentTime &&               // Exclude listings with expired returnDate
                Number(listing.max_amount) > 0   &&                 // Exclude listings with max_amount <= 0
                listing.author != address
            );

            const myOrder = fetchedListings.filter(listing => 
                listing.author == address
            );

            // Set the fetched listings and update loading state
            setListings({
                loadings: false,
                data: fetchedListings,
            });

            setFilteredListings({
                loadings: false,
                data: filteredList,
            });

            setMyLendOrder({
                loadings: false,
                data: myOrder,
            });
        })();
    }, [address]);

    return { 
        loadings: listings.loadings, 
        listingData: listings.data, 
        loadings2: filteredListings.loadings, 
        listingData2: filteredListings.data,
        loadings3: myLendOrder.loadings,
        lendOrder: myLendOrder.data,
    };
};

export default useGetAllListings;
