import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask, convertBigNumber, convertProjectId, getAllProject, getListActiveProject, parseUnixTimeStamp } from '../utils';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


function Projects() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);
    const [projects, setProjects] = useState(null);
    const [currentAddress, SetCurrentAddress] = useState(0);
    const [filterProject, setFilterProject] = useState(0);


    const handleChange = (event) => {
        setFilterProject(event.target.value);
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
        const init = async () => {
            console.log(provider);
            if (!provider) return;
            const handleGetProjects = async () => {
                let listProject
                if (filterProject === 0) {
                    listProject = await getAllProject(provider.getSigner())
                }
                else if (filterProject === 1) {
                    listProject = await getListActiveProject(provider.getSigner())
                }
                console.log(listProject);
                setProjects(listProject)
            }
            try {
                await handleGetProjects()
            } catch {
            }

            const getAddress = async () => {
                const addressCurrent = await provider.getSigner().getAddress();
                SetCurrentAddress(addressCurrent)
            }
            try {
                await getAddress()
            } catch {
            }
        }
        init()
    }, [provider]);
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
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                    <div className='flex justify-end mb-6'>
                        <Button href='/projects/add' variant="outlined">Thêm mới dự án</Button>
                    </div>
                }

                <div className='flex justify-between'>
                    <h1 className='font-bold text-3xl'>Danh sách các dự án</h1>
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl fullWidth>
                            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterProject}
                                // label="Lọc"
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Tất cả dự án</MenuItem>
                                <MenuItem value={1}>Dự án đang mở ủng hộ</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                {projects?.map((item) => {
                    return <a key={convertProjectId(item.projectId)} href={`project-detail/${convertProjectId(item.projectId)}`}>
                        <div className='flex m-4 p-4'>
                            <img className='w-40' src={item.imageUrl} alt="" />
                            <div className='ml-4'>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <p>{item.objective}</p>
                                <div>
                                    <div>Mục tiêu: {convertBigNumber(item.amount)} <span className='font-bold'>USD</span></div>
                                    <div className='flex'>
                                        <p>Tiến độ:</p>
                                        <p className='ml-2'>
                                            {(convertBigNumber(item && item.totalDonations) / convertBigNumber(item && item.amount)) * 100 > 100 ?
                                                100 : ((convertBigNumber(item.totalDonations) / convertBigNumber(item.amount)) * 100).toFixed(1)
                                            }
                                            %
                                        </p>
                                    </div>
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