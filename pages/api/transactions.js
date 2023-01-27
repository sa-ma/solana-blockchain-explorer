import * as solanaWeb3 from '@solana/web3.js';

const DEV_NET = solanaWeb3.clusterApiUrl('devnet');
const solanaConnection = new solanaWeb3.Connection(DEV_NET);

const getAddressInfo = async (address, numTx = 3) => {
    const pubKey = new solanaWeb3.PublicKey(address);
    const transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: numTx });
    const accountBalance = await solanaConnection.getBalance(pubKey);

    return { transactionList, accountBalance };
};

const handler = async (req, res) => {
    const queryAddress = req.query?.address;
    if (!queryAddress) {
        return res.status(401).json({
            message: 'Invalid address',
        });
    }
    try {
        const { accountBalance, transactionList } = await getAddressInfo(queryAddress);
        return res.status(200).json({ transactionList, accountBalance });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later',
        });
    }
};

export default handler;
