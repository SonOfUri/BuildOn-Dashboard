import { getLendbitContract } from '@/config/contracts'
import { wssProvider } from '@/config/provider'
import { useEffect, useState } from 'react'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'

const useListingsEvent = () => {
    const { address } = useWeb3ModalAccount()
    const [bn, setBn] = useState(0)
    const contract = getLendbitContract(wssProvider)
    const createLoanListingFilter = contract.filters.LoanListingCreated(address, null, null, null)
    const serviceRequestFilter = contract.filters.RequestServiced(null, address, null, null)

    return useEffect(() => {
        contract.on(createLoanListingFilter, (e) => {
            console.log("Create loan listing event", e)
            setBn(e.log.blockNumber)
        })

        contract.on(serviceRequestFilter, (e) => {
            console.log("Service request event", e)
            setBn(e.log.blockNumber)
        })

    }, [contract, createLoanListingFilter, serviceRequestFilter])
}

export default useListingsEvent;