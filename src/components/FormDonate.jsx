import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";

import { donateETH, donateBNB, ethToBsc } from "../utils"

import './FormDonateStyles.css'

function FormDonate({ checkTab }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
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
    }, [provider]);


    return (
        <div>
            {checkTab === 0 ? <div className='p-6'>
                <div>
                    <p className='font-bold text-sm'>* Donate Chuyển ETH từ Ethereum Network sang BSC Network (Gas fee minimum 0.000121 ETH, Minimum Crosschain Amount is 0.008 ETH)</p>
                    <input
                        value={amountCrossChain}
                        onChange={(e) => setAmountCrossChain(e.target.value)}
                        placeholder='Amount cross chain'
                        type='number'
                        className='mx-auto'
                    />
                    <div>
                        <button
                            className='w-fit mt-4 px-8 py-2 bg-green-700 text-white font-bold text-lg'
                            onClick={ethToBsc}
                        >
                            Transfer
                        </button>
                    </div>
                </div>
                <div className='mt-6'>
                    <p className='font-bold text-sm'>* Donate bằng ETH trên BSC network</p>
                    <input
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

            </div> : <div className='p-8'>
                <p className='font-bold'>* Donate bằng BNB trên BSC network</p>
                <input
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