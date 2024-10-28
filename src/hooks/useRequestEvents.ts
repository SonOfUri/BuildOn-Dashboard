import { getLendbitContract } from '@/config/contracts'
import { wssProvider } from '@/config/provider'
import { useEffect, useState } from 'react'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'

const useRequestEvent = () => {
    const { address } = useWeb3ModalAccount()
    const [bn, setBn] = useState(0)
    const contract = getLendbitContract(wssProvider)
    const createRequestFilter = contract.filters.RequestCreated(address, null, null, null)
    const serviceRequestFilter = contract.filters.RequestServiced(null, address, null, null)
    const repayLoanFilter = contract.filters.LoanRepayment(address, null, null)
    const liquidateEvent = contract.filters.RequestLiquidated(null, address, null)

    return useEffect(() => {
        contract.on(createRequestFilter, (e) => {
            console.log("Create request event", e)
            setBn(e.log.blockNumber)
        })

        contract.on(serviceRequestFilter, (e) => {
            console.log("Service request event", e)
            setBn(e.log.blockNumber)
        })

        contract.on(repayLoanFilter, (e) => {
            console.log("Loan repayment event", e)
            setBn(e.log.blockNumber)
        })

        contract.on(liquidateEvent, (e) => {
            console.log("Liquidate request event", e)
            setBn(e.log.blockNumber)
        })

    }, [contract, createRequestFilter, serviceRequestFilter, repayLoanFilter, liquidateEvent])
}

export default useRequestEvent;