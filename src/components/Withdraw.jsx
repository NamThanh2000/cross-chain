import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { convertBigNumber, getAllHistoryProject, getListWithdrawProject, parseUnixTimeStamp, withdrawUSDT } from "../utils";
import { useForm } from 'react-hook-form';

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

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

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

    const onSubmit = async data => {
        if (!provider) return;
        const signer = provider.getSigner()
        setBtnDisable(true)
        const widthdraw = await withdrawUSDT(signer, provider, data['amount'], projectId, data['content'])
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
            <Box component='form' className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                <p className='font-bold'>Rút tiền</p>
                {/* <div className='py-6 text-lg'>Donate monthly as a Conservation Champion and provide reliable support to accelerate the pace of conservation today. Plus, receive our special picnic blanket as a thank you gift for protecting nature.</div> */}
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' && <>
                    <div className='flex flex-col w-full mt-4'>
                        <div>
                            <input
                                className='p-3 rounded w-full'
                                // value={amountCrossChain}
                                // onChange={(e) => setAmountCrossChain(e.target.value)}
                                placeholder='Nhập số lượng USDT muốn rút'
                                type='number'
                                {...register("amount", { required: true })}
                            />
                            {errors.content && errors.content.type === "required" && (
                                <span className='text-sm text-red-600'>Số tiền rút là bắt buộc</span>
                            )}
                        </div>
                        <div className=' w-full'>
                            <textarea
                                {...register("content", { required: true, maxLength: 1000 })}

                                type='string'
                                style={{ border: '1px solid #e5e7eb' }}
                                className='w-full mt-2 p-3 rounded focus:outline-green-700'
                                placeholder='Nội dung rút tiền' name="content" id="" cols="30" rows="10">
                            </textarea>
                            {errors.content && errors.content.type === "required" && (
                                <span className='text-sm text-red-600'>Nội dung rút tiền là bắt buộc.</span>
                            )}
                        </div>
                    </div>
                    <p className='mt-2 text-sm italic'>Số dư USDT: <span className='font-bold' style={{ color: "#2E7D32" }}>{totalDonate} USDT</span></p>
                    <Button type='submit' sx={{ marginTop: 4 }} variant="contained" disabled={btnDisable} color="success" size="large">Rút Tiền</Button>
                </>
                }
            </Box>
        </div>

    );
}

export default Withdraw;  