export const formatAddress = (address: string | undefined) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`
}