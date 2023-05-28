import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask, convertBigNumber, getAllHistoryProject, getProjectDetail, parseUnixTimeStamp } from '../utils';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { TabContext } from '@material-ui/lab';
import { Tab, Tabs } from '@material-ui/core';
import FormDonate from './FormDonate';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import { useParams } from 'react-router-dom';
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


function ProjectDetail() {
    const [provider, setProvider] = useState(null);
    const [value, setValue] = useState(0);
    const [currentAddress, setCurrentAddress] = useState(0);
    const [project, setProject] = useState(null);
    const { param } = useParams();
    const handleChange = (event, newValue) => {
        localStorage.setItem("tab", newValue);
        setValue(newValue);
    };
    useEffect(() => {
        const init = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                console.error("Không tìm thấy MetaMask");
                return;
            }
            const provider = new Web3Provider(ethereumProvider);
            setProvider(provider)
            const network = await provider.getNetwork();
            const chainid = network.chainId;
            if (chainid === 0) setValue(0)
            else if (chainid === 56) setValue(1)
            else {
                const checkTabStorage = localStorage.getItem("tab");
                setValue(checkTabStorage ? checkTabStorage : 0)
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!provider) return;
        const init = async () => {
            const signer = provider.getSigner()
            const getAddress = async () => {
                const addressCurrent = await signer.getAddress();
                setCurrentAddress(addressCurrent)
            }
            const project = await getProjectDetail(signer, param)
            setProject(project)
            await getAddress()
        }
        init()

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
                <div className="flex px-5 xl:px-38 md:px-16 sm:px-16 mt-20">
                    <div className="mx-10">
                        <div className="border-t-4 border-green-700 mb-6">
                            <h1 className="text-3xl my-6"
                                style={{
                                    fontFamily: 'Chronicle Text G2 A,Chronicle Text G2 B,ui-serif,Georgia,Cambria,Times New Roman,Times,serif'
                                }}
                            >{project && project.title}</h1>
                            <div className="flex">
                                <img className='w-40' src={project && project.imageUrl} alt="Nature slice" />
                                <div className="ml-6 text-lg">
                                    <p>{project && project.objective}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            {project && <div className='flex'>
                                <div className='flex'>
                                    <PaidIcon sx={{ marginRight: '4px' }} color='success' />
                                    {convertBigNumber(project.totalDonations).toFixed(4)}
                                    <p className=' ml-2 font-bold'>USD</p>
                                </div>
                                <div className='ml-10 flex'>
                                    <CalendarMonthIcon sx={{ marginRight: '4px' }} color='success' />
                                    {parseUnixTimeStamp(project && project.deadline)}
                                </div>
                            </div>}
                        </div>
                        <div>
                            <TabContext >
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {/* <h4 className="text-base font-bold text-green-700">ENTER YOUR GIFT AMOUNT</h4> */}
                                        <Tabs
                                            value={Number(value)}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons={false}
                                            aria-label="basic tabs example"
                                            textColor="primary"
                                        >
                                            <Tab label="Ethereum Platform" value={0} />
                                            <Tab label="Binance smart chain Platform" value={1} />
                                            <Tab label="Your Donate" value={2} />
                                            {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                                                <Tab label="Withdraw" value={3}/>
                                            }
                                        </Tabs>
                                    </Box>
                                </Box>
                                <FormDonate projectId={param} checkTab={Number(value)} />
                            </TabContext >
                        </div>
                        <div className="mt-10 border-t-4 border-green-700 mb-6">
                            <div>
                                <h2 className='mt-6 text-2xl font-bold'>Các Tổ Chức Cùng Đồng Hành</h2>
                                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                                    <div className='flex justify-end mb-6'>
                                        <Button href='/organization-add' variant="outlined">Thêm Tổ Chức</Button>
                                    </div>
                                }
                            </div>
                            <div className='mt-4'>
                                <h3 className='text-xl font-bold'>1. VietComBank</h3>
                                <div className='flex items-start  mt-4'>
                                    <img className='w-40' src="https://admin.tamlyvietphap.vn/uploaded/Images/Original/2020/10/16/logo_vietcombank_1610091313.jpg" alt="" />
                                    <p className='ml-6'>Ngân hàng TMCP Ngoại thương Việt Nam tên viết tắt: "Vietcombank", là công ty lớn nhất trên thị trường chứng khoán Việt Nam tính theo vốn hóa. Hiện tại Ngân hàng nhà nước Việt Nam nắm giữ 75% cổ phần và là cổ đông lớn nhất.</p>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <h3 className='text-xl font-bold'>2. BIDV</h3>
                                <div className='flex items-start  mt-4'>
                                    <img className='w-40' src="https://cdn.tgdd.vn/2020/03/GameApp/image(14)-200x200-1.png" alt="" />
                                    <p className='ml-6'>Ngân hàng TMCP Đầu tư và Phát triển Việt Nam tên gọi tắt: "BIDV", là ngân hàng thương mại lớn nhất Việt Nam tính theo quy mô tài sản năm 2019 và là doanh nghiệp đứng thứ 10 trong danh sách 1000 doanh nghiệp đóng thuế thu nhập doanh nghiệp lớn nhất năm 2018.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:mx-10 mx-4 md:mx-4 sm:mx-4">
                        <img src="/NCM130311.png" alt="NCM130311" />
                        <div className="px-6 pt-6 flex flex-col items-center">
                            <h4 className="font-bold text-lg">Your gift helps...</h4>
                            {project &&
                                (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100 > 100 ?

                                <CircularProgressbar className='w-44 mt-4' value='100' text={`100%`} /> :
                                <CircularProgressbar className='w-44 mt-4' value={(convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100} text={`${(convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100}%`} />

                            }

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ProjectDetail;  