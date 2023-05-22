import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask, getAllProject } from '../utils';
import { Box, Button, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useForm } from "react-hook-form";

function AddProject() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);
    const [projects, setProjects] = useState(null);
    const [age, setAge] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    const handleChange = (event) => {
        setAge(event.target.value);
    };

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

    useEffect(() => {
        checkConnectMetamask();
        if (!provider) return;
        // const handleGetProjects = async () => {
        //     const allProject = await getAllProject(provider.getSigner())
        //     console.log(allProject)
        // }
        // handleGetProjects()
    }, [provider]);

    return (
        <>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 p-2 flex justify-between ">
                    <div className="flex items-end">
                        <img className="w-26 h-12 mr-10 text-gray-700" src="/tnc-logo-primary-registered-dark-text.svg" alt="logo" />
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>Homepage</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/projects'>Projects</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>News & Events</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>About Us</a>
                        <a href="/donate">
                            <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
                        </a>
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
                    <TextField {...register("example")} fullWidth id="outlined-basic" label="Outlined" variant="outlined" />
                    <TextField {...register("example1")} fullWidth id="outlined-basic" label="Outlined" variant="outlined" />
                    <TextField {...register("example2")} fullWidth id="outlined-basic" label="Outlined" variant="outlined" />
                    <TextField {...register("example3")} fullWidth id="outlined-basic" label="Outlined" variant="outlined" />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker {...register("example4")} label="Basic date time picker" />
                    </LocalizationProvider>
                    <Button type='submit' variant="contained">Contained</Button>
                </Box>
            </div>

        </>
    );
}

export default AddProject;  