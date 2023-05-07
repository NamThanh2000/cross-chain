import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import Header from './Header'
import { getBalances, withdrawUSDT } from "../utils"
import toast from 'react-hot-toast';

function FormDonate() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(0);
    const [totalDonate, SetTotalDonate] = useState(0);
    const [currentAddress, SetCurrentAddress] = useState(0);
    const [amountCrossChain, setAmountCrossChain] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);

    useEffect(() => {
        const init = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                console.error("Không tìm thấy MetaMask");
                return;
            }

            setProvider(new Web3Provider(ethereumProvider));

            ethereumProvider.on("chainChanged", () => {
                window.location.reload();
            });

            ethereumProvider.on("accountsChanged", () => {
                window.location.reload();
            });
        };

        init();
    }, []);

    useEffect(() => {
        if (!provider) return;
        setSigner(provider.getSigner());
        const getChainId = async () => {
            const network = await provider.getNetwork();
            const chainid = network.chainId;
            setChainId(chainid)
        }
        getChainId()

        const getAddress = async () => {
            const addressCurrent = await provider.getSigner().getAddress();
            SetCurrentAddress(addressCurrent)
        }
        getAddress()

    }, [provider]);

    useEffect(() => {
        if (chainId === 1) {
            const ethereumMainnet = {
                chainId: '0x38',
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'], // RPC endpoint of BSC mainnet
                blockExplorerUrls: ['https://bscscan.com/'], // Block explorer URL of BSC mainnet
            };

            window.ethereum.request({ method: 'wallet_addEthereumChain', params: [ethereumMainnet] })
                .then(() => console.log('Ethereum mainnet added to Metamask'))
                .catch((error) => console.error(error));
        }
        else if (chainId === 56) {
            console.log(chainId);
            const init = async () => {
                const totalDonations = await getBalances(provider.getSigner(), provider, 1)
                SetTotalDonate(totalDonations)
            }

            init()
        }
    }, [chainId])
    const handleWithdraw = async () => {
        setBtnDisable(true)
        const widthdraw = await withdrawUSDT(signer, provider, amountCrossChain)
        if (widthdraw) {
            toast.success("Widthdraw success");
        }
        else {
            toast.error("Widthdraw failed");
        }
        setBtnDisable(false)
    }
    return (
        <div>
            <Header />
            <div
                className='w-100 flex justify-center items-center flex-col text-5xl font-bold text-white'
                style={{
                    backgroundImage: 'url(/tnc_45019999_Large.jpg)', backgroundSize: 'cover', height: '60vh', textShadow: '2px 2px 4px rgba(0,0,0,.35)',
                    fontFamily: 'Chronicle Text G2 A, Chronicle Text G2 B, Chronicle Text G2, Georgia, serif'
                }}
            >
                <p>THANK YOU</p>
                <p className='mt-2'>This is a Part of Everyone</p>
            </div>
            <div className='flex justify-center flex-col items-center py-20 border-gray-300'
                style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
            >
                <h2 className='text-5xl mt-5 font-medium'>Everyone's Donate</h2>
                <p className='text-5xl my-5'>{Math.round(totalDonate)} USDT</p>
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                    <a href='/donate' className='mt-5 px-8 py-3 bg-green-700  text-white font-bold'>Donate</a>
                }
            </div>
            <div className='flex my-28 mx-40 items-center'>
                <div className='px-20'>
                    <h2 className='text-4xl font-bold'>Protect nature all year round</h2>
                    <div className='py-6 text-lg'>Donate monthly as a Conservation Champion and provide reliable support to accelerate the pace of conservation today. Plus, receive our special picnic blanket as a thank you gift for protecting nature.</div>
                    <input
                        className='mt-2 p-4'
                        value={amountCrossChain}
                        onChange={(e) => setAmountCrossChain(e.target.value)}
                        placeholder='Amount cross chain'
                        type='number'
                    />
                    <div>
                        <button
                            onClick={handleWithdraw}
                            disabled={btnDisable}
                            style={{ opacity: `${btnDisable ? 0.7 : 1}` }}
                            className='mt-4 px-8 py-3 bg-green-700  text-white font-bold'
                            href="/donate"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
                <div className='flex1'>
                    <img src="/PaintDRTV.jpg" alt="PaintDRTV" />
                </div>
            </div>
        </div>

    );
}

export default FormDonate;  