import { Box, FormControl, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { parseUnixTimeStamp } from "../utils";

const donationAbi = require('../DonationAbi')

function Withdraw({ projectId, signer, addressCurrent, totalWithdrawn, totalDonations }) {
    const [btnDisable, setBtnDisable] = useState(false);
    const [listWithdraw, setListWithdraw] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUpImage, handleSubmit: handleSubmitImage, watch, formState: { errors: errorsImage } } = useForm();
    const selectWithdrawalId = watch('withdrawalId', 0)
    const imageUrl = watch('imageUrl', 0)

    useEffect(() => {
        if (signer) {
            const init = async () => {
                const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
                const listWithdraw = await donationContract.getWithdrawalHistory(projectId)
                setListWithdraw(listWithdraw)
            }
            init();
        }
    }, [signer]);

    const onSubmit = async data => {
        if (signer) {
            setBtnDisable(true)
            const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
            const amountWithdraw = ethers.utils.parseUnits(data['amount'], 18);
            const donateTx = await donationContract.withdraw(projectId, amountWithdraw, data['content']);
            await donateTx.wait();
            if (donateTx) toast.success("Rút tiền thành công");
            else toast.error("Rút tiền thất bại");
            setBtnDisable(false)
        }
    }

    const onSubmitUpImage = async data => {
        if (selectWithdrawalId !== 0) {
            const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
            const addWithdrawImage = await donationContract.addWithdrawImage(projectId, selectWithdrawalId, imageUrl)
            if (addWithdrawImage) toast.success("Tải ảnh thành công");
            else toast.error("Tải ảnh thất bại");
        }
    }
    return (
        <Box className='mt-8'>
            {addressCurrent === process.env.REACT_APP_OWNING_ADDRESS && <>
                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    <Box className='flex flex-col w-full mt-4'>
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
                    <p className='mt-2 text-sm italic'>Số USDT còn lại: <span className='font-bold' style={{ color: "#2E7D32" }}>{ethers.utils.formatUnits(totalDonations.toString(), 18) - ethers.utils.formatUnits(totalWithdrawn.toString(), 18)} USDT</span></p>
                    <p className='mt-2 text-sm italic'>Số USDT đã rút: <span className='font-bold' style={{ color: "#2E7D32" }}>{ethers.utils.formatUnits(totalWithdrawn.toString(), 18)} USDT</span></p>
                    <Button type='submit' sx={{ marginTop: 2 }} variant="contained" disabled={btnDisable} color="success" size="large">Rút Tiền</Button>
                </Box>
                <div className='mt-8 border-t-4 border-green-700'>
                    <Box component='form' onSubmit={handleSubmitImage(onSubmitUpImage)} className='mt-4'>
                        <h3 className='text-lg font-medium'>Đăng tải biên lai sử dụng</h3>
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
                                <InputLabel id="demo-simple-select-label">Ngày rút tiền</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectWithdrawalId}
                                    label="Ngày rút tiền"
                                    {...registerUpImage("dateWithdraw", { required: true })}
                                >
                                    {listWithdraw.map((item, index) => {
                                        return <MenuItem key={index} value={index + 1}>{parseUnixTimeStamp(item.timestamp)}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            {Number(selectWithdrawalId) === 0 && (
                                <span className='text-sm text-red-600'>Ngày rút tiền là bắt buộc.</span>
                            )}
                        </Box>
                        <Button type='submit' sx={{ marginTop: 2 }} variant="contained" color="success" size="large">ĐĂNG TẢI BIÊN LAI</Button>
                    </Box>
                </div>
            </>
            }
        </Box>
    );
}

export default Withdraw;  