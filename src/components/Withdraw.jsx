import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { addWithdrawImage, convertBigNumber, getAllHistoryProject, getListWithdrawProject, parseUnixTimeStamp, withdrawUSDT } from "../utils";
import { useForm } from 'react-hook-form';

function Withdraw({ projectId }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(0);
    const [totalDonate, SetTotalDonate] = useState(0);
    const [currentAddress, SetCurrentAddress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(false);
    const [listHistoryDonate, setListHistoryDonate] = useState(false);
    const [listWithdraw, setListWithdraw] = useState([]);
    const [imageURL, setImageURL] = useState('');


    const { register, handleSubmit, formState: { errors } } = useForm();

    const { register: registerUpImage, handleSubmit: handleSubmitImage, watch, formState: { errors: errorsImage } } = useForm();
    const selectDateWithdraw = watch('dateWithdraw', 0)

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
            try {
                const listWithdraw = await getListWithdrawProject(provider.getSigner(), projectId)
                console.log(listWithdraw);
                setListWithdraw(listWithdraw)
            } catch { }
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
                try {
                    const result = await getAllHistoryProject(signer, projectId)
                    setListHistoryDonate(result)
                }
                catch { }

                init()
            }
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

    const onSubmitUpImage = async data => {
        if (Number(selectDateWithdraw) !== 0) {
            console.log(data);
            // if (!provider) return;
            // const signer = provider.getSigner()
            // setBtnDisable(true)
            // const result = await addWithdrawImage(signer, projectId, data['amount'], projectId, data['content'])
            // if (result) {
            //     toast.success("Up picture success");
            // }
            // else {
            //     toast.error("Up picture failed");
            // }
            // setBtnDisable(false)
        }
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
            <Box className='mt-8'>
                {/* <div className='py-6 text-lg'>Donate monthly as a Conservation Champion and provide reliable support to accelerate the pace of conservation today. Plus, receive our special picnic blanket as a thank you gift for protecting nature.</div> */}
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' && <>
                    <Box component='form' onSubmit={handleSubmit(onSubmit)} className='border-t-4 border-green-700'>
                        <Box className='flex flex-col w-full mt-4'>
                            <p className='font-medium text-lg'>RÚT TIỀN</p>
                            <div className='mt-2'>
                                <input
                                    className='p-3 rounded w-full'
                                    placeholder='Nhập số lượng USDT muốn rút'
                                    type='number'
                                    {...register("amount", { required: true })}
                                />
                                {errors.amount && errors.amount.type === "required" && (
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
                        </Box>
                        <p className='mt-2 text-sm italic'>Số dư USDT: <span className='font-bold' style={{ color: "#2E7D32" }}>{totalDonate} USDT</span></p>
                        <Button type='submit' sx={{ marginTop: 2 }} variant="contained" disabled={btnDisable} color="success" size="large">Rút Tiền</Button>
                    </Box>
                    <div className='mt-8 border-t-4 border-green-700'>
                        <Box component='form' onSubmit={handleSubmitImage(onSubmitUpImage)} className='mt-4'>
                            <h3 className='text-lg font-medium'>ĐĂNG TẢI BIÊN LAI RÚT TIỀN</h3>
                            <input
                                className='mt-2 p-3 rounded w-full'
                                placeholder='Đường dẫn ảnh'
                                type='string'
                                {...registerUpImage("imageUrl", { required: true })}
                            />
                            {errorsImage?.imageUrl && errorsImage?.imageUrl.type === "required" && (
                                <span className='text-sm text-red-600'>Đường dẫn ảnh là bắt buộc.</span>
                            )}
                            <Box sx={{ minWidth: 220, marginTop: 1 }}>
                                <FormControl color="success" fullWidth >
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        // label='Ngày rút tiền'
                                        value={selectDateWithdraw}
                                        {...registerUpImage("dateWithdraw", { required: true })}
                                    >
                                        <MenuItem value={0}>Ngày rút tiền</MenuItem>
                                        {listWithdraw?.map((item, index) => {
                                            return <MenuItem key={index} value={index + 1}>{parseUnixTimeStamp(item.timestamp)}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                {Number(selectDateWithdraw) === 0 && (
                                    <span className='text-sm text-red-600'>Ngày rút tiền là bắt buộc.</span>
                                )}
                            </Box>
                            <Button type='submit' sx={{ marginTop: 2 }} variant="contained" color="success" size="large">ĐĂNG TẢI BIÊN LAI</Button>
                        </Box>
                    </div>
                </>
                }
            </Box>
        </div>

    );
}

export default Withdraw;  