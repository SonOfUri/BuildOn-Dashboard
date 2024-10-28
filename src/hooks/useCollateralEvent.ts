import { getLendbitContract } from '@/config/contracts'
import { wssProvider } from '@/config/provider'
import { useEffect, useState } from 'react'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'

const useCollateralEvent = () => {
    const { address } = useWeb3ModalAccount()
    const [bn, setBn] = useState(0)
    const contract = getLendbitContract(wssProvider)
    const depositFilter = contract.filters.CollateralDeposited(address, null, null)
    const withdrawFilter = contract.filters.CollateralWithdrawn(address, null, null)

    useEffect(() => {
        contract.on(depositFilter, (e) => {
            console.log("Deposit event", e)
            setBn(e.log.blockNumber)
        })

        contract.on(withdrawFilter, (e) => {
            console.log("Withdraw event", e)
            setBn(e.log.blockNumber)
        })

    }, [contract, depositFilter, withdrawFilter])
}

export default useCollateralEvent;