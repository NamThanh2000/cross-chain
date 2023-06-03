import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { addProject, connectMetamask, getAllProject } from '../utils';
import { Box, Button, TextField, TextareaAutosize } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker, StaticDateTimePicker } from '@mui/x-date-pickers';
import { useForm } from "react-hook-form";
import { styled } from '@mui/system';

function AddProject() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);
    const [projects, setProjects] = useState(null);
    const [datetime, setDatetime] = useState('');

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

    async function checkConnectMetamask() {
        if (typeof window.ethereum === 'undefined') {
            setIsConnectMetamask(true);
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                setIsConnectMetamask(true);
                return;
            }
        } catch (error) {
            setIsConnectMetamask(true);
            return;
        }
    }


    // const handleSubmitProject = async () => {

    // }

    const onSubmit = async data => {
        if (!provider) return;
        const signer = provider.getSigner()
        const dateStr = datetime.$d ? datetime.$d.toString().slice(0, datetime.$d.toString().indexOf('(')) : ''
        const date = new Date(dateStr);
        const unixTimestamp = Math.floor(date.getTime() / 1000);
        data['unixTimestamp'] = unixTimestamp
        const result = await addProject(signer, data)
        if (result) {
            window.location.href = '/projects'
        }

    }

    return (
        <>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 p-2 flex justify-between ">
                    <div className="flex items-end">
                        <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>TRANG CHỦ</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/projects'> CÁC DỰ ÁN</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/profile'>THÔNG TIN CỦA BẠN</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/about'>VỀ CHÚNG TÔI</a>
                        {/* <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
            </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        '& > :not(style)': { margin: '20px 0', display: 'block' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField {...register("title")} fullWidth id="title" label="Tên dự án mới" variant="outlined" />
                    <TextField {...register("image_url")} fullWidth id="image_url" label="Đường dẫn ảnh" variant="outlined" />
                    <TextField {...register("amount")} fullWidth id="amount" label="Mục tiêu dự án (USD)" variant="outlined" />
                    <textarea className='w-full' name="abjactive" {...register("objective")} id="" cols="30" rows="10"></textarea>
                    {/* <TextField {...register("objective")} fullWidth id="objective" label="Mô tả dự án" variant="outlined" /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDateTimePicker
                            sx={{ width: '400px' }}
                            name='time'
                            onChange={(newValue) => setDatetime(newValue)}
                            label="Hạn chót ủng hộ ádasdasdikajsndijasnd9uasjndsioan9dsajnsiudjn"
                            orientation="portrait"
                            ampm={false}
                            ampmInClock={false}
                        />
                    </LocalizationProvider>
                    <Button type='submit' variant="contained">Tạo dự án mới</Button>
                </Box>
            </div>

        </>
    );
}
export default AddProject;
