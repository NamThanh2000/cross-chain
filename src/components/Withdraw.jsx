import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import Header from './Header'
import { getBalance } from "../utils"
import CountUp from 'react-countup/build/CountUp';

function FormDonate() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [totalDonate, SetTotalDonate] = useState(0);
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
        const init = async () => {
            const totalDonations = await getBalance(provider.getSigner(), provider, 1)
            SetTotalDonate(totalDonations)
        }

        init()
    }, [provider]);
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
                <p className='text-5xl mt-5'>{totalDonate.toFixed(3)} USDT</p>
                <CountUp
                    start={-875.039}
                    end={160527.012}
                    duration={2.75}
                    separator=" "
                    decimals={4}
                    decimal=","
                    prefix="EUR "
                    suffix=" left"
                    onEnd={() => console.log('Ended! 👏')}
                    onStart={() => console.log('Started! 💨')}
                >
                    {({ countUpRef, start }) => (
                        <div>
                            <span ref={countUpRef} />
                            <button onClick={start}>Start</button>
                        </div>
                    )}
                </CountUp>
            </div>
            <div className='flex my-28 mx-40 items-center'>
                <div className='px-20'>
                    <h2 className='text-4xl font-bold'>Protect nature all year round</h2>
                    <div className='py-6 text-lg'>Donate monthly as a Conservation Champion and provide reliable support to accelerate the pace of conservation today. Plus, receive our special picnic blanket as a thank you gift for protecting nature.</div>
                    <a className='px-8 py-3 bg-green-700  text-white font-bold' href="/donate">Donate</a>
                </div>
                <div className='flex1'>
                    <img src="/PaintDRTV.jpg" alt="PaintDRTV" />
                </div>
            </div>
        </div>

    );
}

export default FormDonate;  