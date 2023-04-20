import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";

import { donateETH, donateBNB, ethToBsc } from "../utils"

import './FormDonateStyles.css'

function FormDonate({ checkTab }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(0);
    const [amountCrossChain, setAmountCrossChain] = useState('');
    const [amountDonateETH, setAmountDonateETH] = useState('');
    const [amountDonateBNB, setAmountDonateBNB] = useState('');
    const [amountWithdrawUSDT, setAmountWithdrawUSDT] = useState('');
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

    return (
        <div>
            {Number(checkTab) === 0 && <div className='p-6'>
                {chainId === 1 && <div>
                    <p className='font-bold'>* Donate Chuyển ETH từ Ethereum Network sang BSC Network (Gas fee minimum 0.000121 ETH, Minimum Crosschain Amount is 0.008 ETH)</p>
                    <input
                        className='mt-2'
                        value={amountCrossChain}
                        onChange={(e) => setAmountCrossChain(e.target.value)}
                        placeholder='Amount cross chain'
                        type='number'
                    />
                    <div>
                        <button
                            className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                            onClick={ethToBsc}
                        >
                            Transfer
                        </button>
                    </div>
                </div>}
                {chainId === 56 && <div>loading</div>}

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

                                className='mt-2'
                                value={amountDonateBNB}
                                onChange={(e) => setAmountDonateBNB(e.target.value)}
                                placeholder='Amount Donate BNB'
                                type='number'
                            />
                            {/* Donate bằng BNB trên BSC network */}
                            <div>
                                <button
                                    className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                                    onClick={donateBNB}
                                >
                                    Donate
                                </button>
                            </div>
                        </div>
                        <div className='p-8'>
                            <p className='font-bold'>* Donate bằng ETH trên BSC network</p>
                            <input

                                className='mt-2'
                                value={amountDonateETH}
                                onChange={(e) => setAmountDonateETH(e.target.value)}
                                placeholder='Amount Donate ETH'
                                type='number'
                            />
                            {/* Donate bằng ETH trên BSC network */}
                            <div>
                                <button
                                    className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                                    onClick={donateETH}
                                >
                                    Donate
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                    {chainId === 1 && <div>loading</div>}
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