import { Box, Button, TextField } from '@mui/material';
import { StaticDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";

const donationAbi = require('../DonationAbi')

function AddProject({ signer }) {
    const [datetime, setDatetime] = useState('');
    const { register, handleSubmit, watch, formState: { errors } } = useForm();


    const onSubmit = async data => {
        if (signer) {
            const dateStr = datetime.$d ? datetime.$d.toString().slice(0, datetime.$d.toString().indexOf('(')) : ''
            const date = new Date(dateStr);
            const unixTimestamp = Math.floor(date.getTime() / 1000);
            const amountUnit = ethers.utils.parseUnits(data.amount, 18);
            const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
            try {
                const donateTx = await donationContract.addProject(data.title, data.objective, unixTimestamp, amountUnit, data.image_url)
                await donateTx.wait();
                toast.success(`Tạo dự án thành công`);
                window.location.href = '/project-detail/' + ethers.utils.formatUnits(donateTx.value.toString(), 0)
            } catch {
                toast.error("Tạo dự án thất bại");
            }
            
        }
    }

    return (
        <>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 flex justify-between ">
                    <div className="flex items-center">
                        <Link to="/">
                            <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link className='mx-2 px-2 py-4 text-lg' to='/'>TRANG CHỦ</Link>
                        <Link style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' to='/projects'> CÁC DỰ ÁN</Link>
                        <Link className='mx-2 px-2 py-4 text-lg' to='/profile'>THÔNG TIN CỦA BẠN</Link>
                        <Link className='mx-2 px-2 py-4 text-lg' to='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</Link>
                        <Link className='mx-2 px-2 py-4 text-lg' to='/about'>VỀ CHÚNG TÔI</Link>
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                <div className='font-medium mt-6 text-lg text-center'>THÊM DỰ ÁN MỚI</div>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        '& > :not(style)': { margin: '20px 0', display: 'block' },
                    }}
                    noValidate
                    autoComplete="off" 
                >
                    <TextField color="success" {...register("title")} fullWidth id="title" label="Tên dự án mới" variant="outlined" />
                    <TextField color="success" {...register("image_url")} fullWidth id="image_url" label="Đường dẫn ảnh" variant="outlined" />
                    <TextField color="success" {...register("amount")} fullWidth id="amount" label="Mục tiêu dự án (USD)" variant="outlined" />
                    <TextField color="success" {...register("objective")} multiline fullWidth id="amount" label="Giới thiệu về dự án" variant="outlined" />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDateTimePicker
                            sx={{ width: '300px' }}
                            name='time'
                            onChange={(newValue) => setDatetime(newValue)}
                            label="Hạn chót ủng hộ ádasdasdikajsndijasnd9uasjndsioan9dsajnsiudjn"
                            orientation="portrait"
                            ampm={false}
                            ampmInClock={false}
                        />
                    </LocalizationProvider>
                    <Button type='submit' color="success" variant="contained">Tạo dự án mới</Button>
                </Box>
            </div>
            <div className='py-8 px-44 h-82 bg-black'>
                <div>
                    <div className='flex justify-around'>
                        <div className=''>
                            <div className='w-64'>
                                <Link to="/">
                                    <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                                </Link>
                            </div>
                            <div className='mt-4 text-white text-xs w-96'>
                                Chào mừng bạn đến với tổ chức quyên góp quỹ thiện nguyện! Chúng tôi cam kết xây dựng một thế giới tốt đẹp hơn thông qua những hành động thiện nguyện. Với sứ mệnh hỗ trợ cộng đồng và giúp đỡ những người gặp khó khăn, chúng tôi tập trung vào việc gây quỹ và chia sẻ tài nguyên để tạo ra những tác động tích cực. Hãy cùng nhau chung tay để thay đổi cuộc sống và lan tỏa tình yêu thương đến tất cả mọi người.
                            </div>
                            <div className='mt-8 text-white text-xs'>
                                © 2023-Quyên góp vì môi trường
                            </div>
                        </div>
                        <div>
                            <h3 className='text-white'>Kết Nối</h3>
                            <div className='mt-4'>
                                <div className='text-white text-xs'>Giới thiệu</div>
                                <div className='text-white text-xs mt-2'>Liên hệ với chúng tôi</div>
                            </div>
                        </div>
                        <div>
                            <h3 className=' text-white'>Ủng Hộ</h3>
                            <div className='mt-4'>
                                <div className='text-white text-xs'>Dự án</div>
                                <div className='text-white text-xs mt-2'>Ủng hộ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
export default AddProject;
