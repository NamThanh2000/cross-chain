import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Button } from '@mui/material';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { convertBigNumber, getAllHistoryProject, getListWithdrawProject, parseUnixTimeStamp, withdrawUSDT } from "../utils";

function Withdraw({ projectId }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(0);
    const [totalDonate, SetTotalDonate] = useState(0);
    const [currentAddress, SetCurrentAddress] = useState(0);
    const [amountCrossChain, setAmountCrossChain] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);
    const [listHistoryDonate, setListHistoryDonate] = useState(false);
    const [listWithdraw, setListWithdraw] = useState([]);

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
        const init = async () => {
            setSigner(provider.getSigner());
            const getChainId = async () => {
                const network = await provider.getNetwork();
                const chainid = network.chainId;
                setChainId(chainid)
            }
            await getChainId()

            const getAddress = async () => {
                const addressCurrent = await provider.getSigner().getAddress();
                SetCurrentAddress(addressCurrent)
            }
            await getAddress()
            if (chainId === 56) {
                const listWithdraw = await getListWithdrawProject(provider.getSigner(), projectId)
                setListWithdraw(listWithdraw)
            }
        }
        init()


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
            const init = async () => {
                const result = await getAllHistoryProject(signer, projectId)
                setListHistoryDonate(result)
            }

            init()
        }
    }, [chainId])

    const handleWithdraw = async () => {
        setBtnDisable(true)
        const widthdraw = await withdrawUSDT(signer, provider, amountCrossChain, projectId)
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
            {/* <div
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
                <p className='text-5xl my-5'>{Math.floor(total * 100) / 100} USDT</p>
                <a href='/donate' className='mt-5 px-8 py-3 bg-green-700  text-white font-bold'>Donate</a>

            </div> */}
            <div className='mt-4'>
                <h2 className='font-medium mt-6 text-lg'>DANH SÁCH NHỮNG QUYÊN GÓP CỦA TẤT CẢ NGƯỜI QUYÊN GÓP:</h2>
                <div>
                    <div className='pt-10 pb-1 flex justify-center border-gray-300'
                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                    >
                        <p className='w-64 text-lg font-medium text-center'>Số tiền</p>
                        <p className='w-80 text-lg font-medium text-center'>Thời điểm</p>
                    </div>
                    {listHistoryDonate && listHistoryDonate.map((item, index) => {
                        return <div
                            key={index}
                            className='p-3 flex justify-center border-gray-300'
                            style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                        >
                            <p className='w-64 text-green-700 text-lg text-center'>{convertBigNumber(item.amount).toFixed(4)} USD</p>
                            <p className='w-80 text-green-700 text-lg text-center'>{parseUnixTimeStamp(item.timestamp)}</p>
                        </div>
                    })}
                </div>
            </div>
            <div className='mt-8'>
                <p className='font-bold'>Rút tiền</p>
                {/* <div className='py-6 text-lg'>Donate monthly as a Conservation Champion and provide reliable support to accelerate the pace of conservation today. Plus, receive our special picnic blanket as a thank you gift for protecting nature.</div> */}
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' && <>
                    <div className='flex items-center mt-5'>
                        <input
                            className='p-3 rounded'
                            value={amountCrossChain}
                            onChange={(e) => setAmountCrossChain(e.target.value)}
                            placeholder='Nhập số lượng USDT muốn rút'
                            type='number'
                        />
                        <Button sx={{ marginLeft: 5 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={handleWithdraw}>Rút Tiền</Button>
                    </div>
                    <p className='mt-2 text-sm italic'>Số dư USDT: <span className='font-bold' style={{ color: "#2E7D32" }}>{totalDonate} USDT</span></p>
                </>
                }
            </div>
        </div>

    );
}

export default Withdraw;  