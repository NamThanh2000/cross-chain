import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import 'react-spinner-animated/dist/index.css';
import Web3 from 'web3';
import { donateBNB, donateETH, ethToBsc, getMyBalance } from "../utils";
import './FormDonateStyles.css';
import MyDonate from './MyDonate';
import Withdraw from './Withdraw';

function FormDonate({ checkTab, projectId }) {
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
            const changeToETH = async () => {
                // Chuyển mạng từ BNB sang ETH
                try {
                    const web3 = new Web3(window.ethereum);
                    await web3.currentProvider.send('wallet_switchEthereumChain', [{ chainId: '0x1' }]); // Chain ID của Ethereum: 0x1
                    console.log('Đã chuyển mạng thành công');
                } catch (error) {
                    console.error('Lỗi khi chuyển mạng:', error);
                }
            }
            changeToETH()
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
            const donate = await donateBNB(signer, provider, amountDonateBNB, projectId, '')
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
            const donate = await donateETH(signer, provider, amountDonateETH, projectId, '')
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
        else if (Number(amountCrossChain) < 0.007619) {
            toast.error("The crosschain amount must exceed 0.007619 ETH");
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
            {Number(checkTab) === 0 && <div className='p-6'>
                {chainId === 1 && <div>
                    <p className='font-bold'>Transfer ETH from the Ethereum Network to the BSC Network</p>
                    <p className='text-xs'>* Crosschain Fee is 0.00 %, Gas Fee is 0.000121 ETH</p>
                    <p className='text-xs'>* Minimum Crosschain Amount is 0.007619 ETH</p>
                    <p className='text-xs'>* Maximum Crosschain Amount is 3,174.6 ETH</p>
                    <p className='text-xs'>* Estimated Time of Crosschain Arrival is 10-30 min</p>
                    <p className='text-xs'>* Crosschain amount larger than 634.92 ETH could take up to 12 hours</p>
                    <input
                        className='mt-2 p-4'
                        value={amountCrossChain}
                        onChange={(e) => setAmountCrossChain(e.target.value)}
                        placeholder='Amount ETH Cross Chain'
                        type='number'
                    />
                    {myBalance && <p className='mt-2 text-sm italic'>Balance: {myBalance[0]} ETH</p>}
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
                {chainId === 56 && <div className='flex justify-center mt-20'>
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
                            <p className='font-bold'>Quyên góp bằng BNB</p>
                            <div className='flex items-center mt-5'>
                                <input
                                    className='p-3 rounded'
                                    // defaultValue={1}
                                    value={amountDonateBNB}
                                    onChange={(e) => setAmountDonateBNB(e.target.value)}
                                    placeholder='Số BNB'
                                    type='number'
                                />
                                <Button sx={{ marginLeft: 5 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={donateBNBHandle}>Quyên góp ngay bằng BNB</Button>
                            </div>
                            {myBalance && <p className='mt-2 text-sm italic'>Số dư BNB của bạn: <span className='font-bold' style={{ color: "#2E7D32" }}>{myBalance[0]} BNB</span></p>}
                            {/* Donate bằng BNB trên BSC network */}
                        </div>
                        <div className='p-8'>
                            <p className='font-bold'>Quyên góp bằng ETH</p>
                            <div className='flex items-center mt-5'>
                                <input
                                    // defaultValue={1}
                                    className='p-3 rounded'
                                    value={amountDonateETH}
                                    onChange={(e) => setAmountDonateETH(e.target.value)}
                                    placeholder='Số ETH'
                                    type='number'
                                />
                                <Button sx={{ marginLeft: 5 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={donateETHHandle}>Quyên góp ngay bằng ETH</Button>
                            </div>
                            {myBalance && <p className='mt-2 text-sm italic'>Số dư ETH của bạn: <span className='font-bold' style={{ color: "#2E7D32" }}>{myBalance[1]} ETH</span></p>}
                            {/* Donate bằng ETH trên BSC network */}
                        </div>
                    </div>
                    }
                    {chainId === 1 && <div className='flex justify-center mt-20'>
                        <CircularProgress color="success" size={50} />
                    </div>}
                </div>

            }
            {Number(checkTab) === 2 && <MyDonate projectId={projectId} />}
            {Number(checkTab) === 3 && <Withdraw projectId={projectId} />}

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