import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask, convertBigNumber, getAllProject, parseUnixTimeStamp } from '../utils';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


function Projects() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);
    const [projects, setProjects] = useState(null);
    const [currentAddress, SetCurrentAddress] = useState(0);
    const [age, setAge] = useState('');
    

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
        const handleGetProjects = async () => {
            const allProject = await getAllProject(provider.getSigner())
            setProjects(allProject)
        }
        handleGetProjects()

        const getAddress = async () => {
            const addressCurrent = await provider.getSigner().getAddress();
            SetCurrentAddress(addressCurrent)
        }
        getAddress()
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
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/contact-us'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/about'>About Us</a>
                        {/* <a href="/donate">
                            <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
                        </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                    <div className='flex justify-end mb-6'>
                        <Button href='/projects/add' variant="outlined">Thêm mới dự án</Button>
                    </div>
                }

                <div className='flex justify-between'>
                    <h1 className='font-bold text-3xl'>Danh sách các dự án</h1>
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                {projects?.map((item) => {
                    return <a key={convertBigNumber(item.projectId)} href={`project-detail/${convertBigNumber(item.projectId)}`}>
                        <div className='flex m-4 p-4'>
                            <img className='w-40' src={item.imageUrl} alt="" />
                            <div className='ml-4'>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <p>{item.objective}</p>
                                <div>
                                    <div>Mục tiêu: {convertBigNumber(item.amount)} USD</div>
                                    <div>Tiến độ: {(item.totalDonations / convertBigNumber(item.amount)) * 100}%</div>
                                    <div>Thời điểm ngừng kêu gọi: {parseUnixTimeStamp(item.deadline)}</div>
                                </div>
                            </div>
                        </div>
                    </a>

                })}
            </div>

        </>
    );
}

export default Projects;  