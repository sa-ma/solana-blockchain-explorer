import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';
import TransactionList from '../components/TransactionList';
import SearchTransactionForm from '../components/SearchTransactionForm';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [transactionList, setTransactionList] = useState([]);
    const [balance, setBalance] = useState(null);
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmit = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            setErrorMessage('');

            const response = await axios.get(`/api/transactions/?address=${address}`);
            if (response.status === 200) {
                setTransactionList(response.data.transactionList);
                const accountBalanceText = response.data.accountBalance;
                const accountBalance = parseInt(accountBalanceText) / 1_000_000_000;

                accountBalance && setBalance(accountBalance);
            }
        } catch (error) {
            setErrorMessage(error?.response.data?.message || 'Unable to fetch transactions. Please try again later.');
        } finally {
        }

        setLoading(false);
    };
    return (
        <>
            <Head>
                <title>Solana Blockchain Explorer</title>
            </Head>
            <main className='w-full h-full max-w-2xl p-6 flex flex-col items-center justify-between gap-6 mx-auto relative'>
                <h1 className='text-2xl'>Solana Blockchain Explorer</h1>
                <SearchTransactionForm
                    handleFormSubmit={handleFormSubmit}
                    address={address}
                    setAddress={setAddress}
                    loading={loading}
                    errorMessage={errorMessage}
                />

                <TransactionList transactionList={transactionList} balance={balance} />

                {loading && (
                    <div className='absolute inset-0 bg-white/70 flex items-center justify-center'>Loading</div>
                )}
            </main>
        </>
    );
}
