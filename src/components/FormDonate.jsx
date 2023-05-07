import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { HalfMalf, DoubleBubble, SlidingPebbles } from 'react-spinner-animated';
import 'react-spinner-animated/dist/index.css'
import { donateETH, donateBNB, ethToBsc, getMyBalance } from "../utils"
import toast from 'react-hot-toast';

import './FormDonateStyles.css'
import { CircularProgress } from '@mui/material';

function FormDonate({ checkTab }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(0);
    const [amountCrossChain, setAmountCrossChain] = useState(null);
    const [amountDonateETH, setAmountDonateETH] = useState(null);
    const [amountDonateBNB, setAmountDonateBNB] = useState(null);
    const [myBalance, setMyBalance] = useState(null);
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
        const getMybalance = async () => {
            const balance = await getMyBalance(provider.getSigner(), provider)
            setMyBalance(balance)
        }
        getMybalance()
    }, [provider]);

    useEffect(() => {
        if (chainId === 56 && Number(checkTab) === 0) {
            const ethereumMainnet = {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://ethmainnet.anyswap.exchange'],
                blockExplorerUrls: ['https://etherscan.io/']
            };

            window.ethereum.request({ method: 'wallet_addEthereumChain', params: [ethereumMainnet] })
                .then(() => console.log('Ethereum mainnet added to Metamask'))
                .catch((error) => console.error(error));
        }
        else if (chainId === 1 && Number(checkTab) === 1) {
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
    }, [Number(checkTab), chainId])

    const donateBNBHandle = async () => {
        if (Number(amountDonateBNB) > Number(myBalance[0])) {
            toast.error("Your wallet is not enough to donate");
        }
        else {
            setBtnDisable(true)
            const donate = await donateBNB(signer, provider, amountDonateBNB)
            if (donate) {
                toast.success("Donate BNB success");
            }
            else {
                toast.error("Donate BNB failed");
            }
            setBtnDisable(false)
        }
    }

    const donateETHHandle = async () => {
        if (Number(amountDonateETH) > Number(myBalance[1])) {
            toast.error("Your wallet is not enough to donate");
        }
        else {
            setBtnDisable(true)
            const donate = await donateETH(signer, provider, amountDonateETH)
            if (donate) {
                toast.success("Donate ETH success");
            }
            else {
                toast.error("Donate ETH failed");
            }
            setBtnDisable(false)
        }
    }

    const ethToBscHandle = async () => {
        if (Number(amountCrossChain) > Number(myBalance[0])) {
            toast.error("Your wallet is not enough to transfer");
        }
        else {
            setBtnDisable(true)
            const donate = await ethToBsc(signer, provider, amountCrossChain)
            if (donate) {
                toast.success("Transfer success");
            }
            else {
                toast.error("Donate failed");
            }
            setBtnDisable(false)
        }
    }


    return (
        <div>
            {Number(checkTab) === 0 && <div className='p-6 flex justify-center'>
                {chainId === 1 && <div>
                    <p className='font-bold'>* Donate Chuyển ETH từ Ethereum Network sang BSC Network (Gas fee minimum 0.000121 ETH, Minimum Crosschain Amount is 0.008 ETH)</p>
                    <input
                        className='mt-2 p-4'
                        value={amountCrossChain}
                        onChange={(e) => setAmountCrossChain(e.target.value)}
                        placeholder='Amount cross chain'
                        type='number'
                    />
                    <div>
                        <button
                            disabled={btnDisable}
                            style={{ opacity: `${btnDisable ? 0.7 : 1}` }}
                            className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                            onClick={ethToBscHandle}
                        >
                            Transfer
                        </button>
                    </div>
                </div>}
                {chainId === 56 && <div className='mt-20'>
                    <CircularProgress color="success" size={50} sx={{ margin: '0 auto' }} />
                </div>}

            </div>
            }
            {
                Number(checkTab) === 1 && <div>
                    {chainId === 56 && <div>
                        <div className='p-8 border-gray-600'
                            style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                        >
                            <p className='font-bold'>* Donate bằng BNB trên BSC network</p>
                            <input

                                className='mt-2 p-4'
                                // defaultValue={1}
                                value={amountDonateBNB}
                                onChange={(e) => setAmountDonateBNB(e.target.value)}
                                placeholder='Amount Donate BNB'
                                type='number'
                            />
                            {/* Donate bằng BNB trên BSC network */}
                            <div>
                                <button
                                    disabled={btnDisable}
                                    style={{ opacity: `${btnDisable ? 0.7 : 1}` }}
                                    className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                                    onClick={donateBNBHandle}
                                >
                                    Donate
                                </button>
                            </div>
                        </div>
                        <div className='p-8'>
                            <p className='font-bold'>* Donate bằng ETH trên BSC network</p>
                            <input
                                // defaultValue={1}
                                className='mt-2 p-4'
                                value={amountDonateETH}
                                onChange={(e) => setAmountDonateETH(e.target.value)}
                                placeholder='Amount Donate ETH'
                                type='number'
                            />
                            {/* Donate bằng ETH trên BSC network */}
                            <div>
                                <button
                                    disabled={btnDisable}
                                    style={{ opacity: `${btnDisable ? 0.7 : 1}` }}
                                    className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                                    onClick={donateETHHandle}
                                >
                                    Donate
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                    {chainId === 1 && <div className='flex justify-center mt-20'>
                        <CircularProgress color="success" size={50} />
                    </div>}
                </div>

            }

            {/* <div>
                <button onClick={getBalance}>Lấy tổng số Donate</button>
                <input
                    value={amountWithdrawUSDT}
                    onChange={(e) => setAmountWithdrawUSDT(e.target.value)}
                    placeholder='Amount Withdraw USDT'
                    type='number'
                />
            </div>
            <div>
                <button onClick={withdrawUSDT}>Rút token</button>
            </div> */}
        </div>
    );
}

export default FormDonate;  