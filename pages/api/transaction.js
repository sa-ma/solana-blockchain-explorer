import * as solanaWeb3 from '@solana/web3.js';

const DEV_NET = solanaWeb3.clusterApiUrl('devnet');
const solanaConnection = new solanaWeb3.Connection(DEV_NET);

const handler = async (req, res) => {
    const transactionHash = req.body.transactionHash;
    if (!transactionHash) {
        return res.status(401).json({
            error: 'Invalid transaction hash',
        });
    }
    try {
        const transaction = await solanaConnection.getParsedTransaction(transactionHash);
        return res.status(200).json({ transaction });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({
            error: 'Server error',
        });
    }
};

export default handler;
