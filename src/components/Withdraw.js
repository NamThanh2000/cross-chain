import { Box, FormControl, MenuItem, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { convertId, parseUnixTimeStamp } from "../utils";

const donationAbi = require('../DonationAbi')

function Withdraw({ projectId, signer, addressCurrent, totalWithdrawn, totalDonations }) {
  const [btnDisable, setBtnDisable] = useState(false);
  const [listWithdraw, setListWithdraw] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUpImage, handleSubmit: handleSubmitImage, watch, formState: { errors: errorsImage } } = useForm();
  const [selectWithdrawalId, setSelectWithdrawalId] = useState('')
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
      try {
        const donateTx = await donationContract.withdraw(projectId, amountWithdraw, data['content']);
        await donateTx.wait();
        toast.success("Rút tiền thành công");
        window.open(`https://bscscan.com/tx/${donateTx.hash}`, '_blank');
      } catch {
        toast.success("Rút tiền thành công");
      }
      setBtnDisable(false)
    }
  }

  const onSubmitUpImage = async data => {
    if (selectWithdrawalId !== '' && signer) {
      setBtnDisable(true)
      try {
        const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
        const donateTx = await donationContract.addWithdrawImage(projectId, selectWithdrawalId, imageUrl)
        await donateTx.wait();
        toast.success("Tải ảnh thành công");
      } catch {
        toast.error("Tải ảnh thất bại");
      }
      setBtnDisable(false)
    }
    else {
      toast.error('Vui lòng chọn ngày rút tiền!')
    }
  }

  const handleChange = (event) => {
    setSelectWithdrawalId(event.target.value);
  };

  const handleClick = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: process.env.REACT_APP_USDT_ADDRESS,
            symbol: 'USDT',
            decimals: 18,
          },
        }
      });
      toast.success("Token đã được thêm thành công vào MetaMask");
    } catch (e) {
      toast.error("Thêm token thất bại");
    }
  };

  return (
    <Box className='mt-8'>
      {addressCurrent === process.env.REACT_APP_OWNING_ADDRESS && <>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Box className='flex flex-col w-full mt-4'>
            <div className='mt-2'>
              <TextField
                color="success"
                fullWidth
                label="Nhập số lượng USDT muốn rút"
                variant="outlined"
                type='number'
                {...register("amount", { required: true })}
              />
              {errors.amount && errors.amount.type === "required" && (
                <span className='text-sm text-red-600'>Số tiền rút là bắt buộc</span>
              )}
            </div>
            <div className=' w-full mt-5'>
              <TextField
                {...register("content", { required: true, maxLength: 1000 })}
                color="success"
                multiline
                fullWidth
                label="Nội dung rút tiền"
              />
              {errors.content && errors.content.type === "required" && (
                <span className='text-sm text-red-600'>Nội dung rút tiền là bắt buộc.</span>
              )}
            </div>
          </Box>
          <p className='mt-2 text-sm italic'>Số USDT còn lại: <span className='font-bold' style={{ color: "#2E7D32" }}>{ethers.utils.formatUnits(totalDonations.toString(), 18) - ethers.utils.formatUnits(totalWithdrawn.toString(), 18)} USDT</span></p>
          <p className='mt-2 text-sm italic'>Số USDT đã rút: <span className='font-bold' style={{ color: "#2E7D32" }}>{ethers.utils.formatUnits(totalWithdrawn.toString(), 18)} USDT</span></p>
          <Button type='submit' sx={{ marginTop: 2 }} variant="contained" disabled={btnDisable} color="success" size="large">Rút Tiền</Button>
        </Box>
        <p className='mt-2 text-xs'>* Nếu chưa có token USDT trên Metamask, vui lòng nhấn vào <button onClick={handleClick} className='underline text-green-600'>đây</button> để thêm token</p>
        <div className='mt-8 border-t-4 border-green-700'>
          <Box component='form' onSubmit={handleSubmitImage(onSubmitUpImage)} className='mt-4'>
            <h3 className='text-lg font-medium mb-5'>Đăng tải biên lai sử dụng</h3>
            <TextField
              color="success"
              multiline
              fullWidth
              label="Đường dẫn ảnh"
              {...registerUpImage("imageUrl", { required: true })}
            />
            {errorsImage?.imageUrl && errorsImage?.imageUrl.type === "required" && (
              <span className='text-sm text-red-600'>Đường dẫn ảnh là bắt buộc.</span>
            )}
            <Box sx={{ minWidth: 220, marginTop: 2 }}>
              <FormControl color="success" fullWidth >
                <InputLabel id="demo-simple-select-label">Ngày rút tiền</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectWithdrawalId}
                  onChange={handleChange}
                  label="Ngày rút tiền"
                >
                  {listWithdraw.map((item, index) => {
                    return <MenuItem key={index} value={convertId(item.withdrawalId)}>{parseUnixTimeStamp(item.timestamp)}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Box>
            <Button type='submit' sx={{ marginTop: 2 }} disabled={btnDisable} variant="contained" color="success" size="large">ĐĂNG TẢI BIÊN LAI</Button>
          </Box>
        </div>
      </>
      }
    </Box>
  );
}

export default Withdraw;  