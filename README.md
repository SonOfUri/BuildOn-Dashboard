


# Lendbit: Decentralized P2P Lending and Borrowing Platform

![Lendbit Logo](public/orange-logo-vertical.png)

## Overview

Lendbit is a decentralized peer-to-peer (P2P) lending and borrowing platform that empowers users with full control over their financial assets, using smart contracts and decentralized finance (DeFi) principles. The frontend of Lendbit is built with **Next.js** to provide a seamless and efficient user experience, integrating features such as **basename** routing and **smart wallet** functionality.

### Key Features

- **Next.js Framework**: Optimized for speed and SEO, delivering a dynamic and responsive user interface.
- **Smart Wallet Integration**: Users can securely interact with the platform using smart wallets for gas-efficient transactions and enhanced security.
- **Basename Support**: Enables deployment flexibility, allowing the app to be hosted on subdomains or specific paths.
- **P2P Loan Interaction**: Borrowers can browse loan offers, and lenders can customize loan terms directly within the interface.
- **Collateral Management**: Easily manage token deposits, loan health, and automated liquidation.

## Smart Wallet Integration

The Lendbit frontend integrates **smart wallet** technology to enhance the user experience by automating gas fees and managing on-chain transactions efficiently. Once a user connects their wallet (such as MetaMask or WalletConnect), the smart wallet functionality kicks in, ensuring smooth interaction with the Lendbit contracts.

## Basename Configuration

Lendbit's frontend uses **basename** to manage routing paths during deployment. This ensures that the platform can be deployed under different base paths (e.g., `/lendbit/` on a custom domain). Configuration of basename is managed within the Next.js routing setup.

## Running the Project Locally

To run the Lendbit frontend locally:

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/lendbit/frontend.git
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

Make sure your wallet is connected and set to the correct network (e.g., Ethereum or Celo) when interacting with the app.

## Deployment

For production deployment, you can build the project and deploy it to services such as Vercel or Netlify:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the built project using your preferred hosting platform.

Ensure that the **basename** is correctly set for the deployment environment.

## Contributing

We welcome contributions! To get started:

1. Fork this repository.
2. Create a branch for your feature or bugfix.
3. Submit a pull request with a clear explanation of your changes.

## Support

If you encounter issues or need assistance, feel free to reach out:

- Email: support@lendbit.com
- Community: [Join our Discord](https://discord.com/invite/lendbit)

---

This README provides a clear guide for setting up and working with the **Next.js** frontend for Lendbit. Let me know if there’s anything else you'd like to add or modify!
