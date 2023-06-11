import { Web3Provider } from '@ethersproject/providers';
import { Tab, Tabs } from '@material-ui/core';
import { TabContext } from '@material-ui/lab';
import detectEthereumProvider from "@metamask/detect-provider";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaidIcon from '@mui/icons-material/Paid';
import CircularProgress from '@mui/joy/CircularProgress';
import { Box, Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { convertBigNumber, getListWithdrawProject, getProjectDetail, parseUnixTimeStamp } from '../utils';
import FormDonate from './FormDonate';
import { data_sample } from '../dataSample';

function HistoryWithdraw() {
    const [provider, setProvider] = useState(null);
    const [value, setValue] = useState(0);
    const [currentAddress, setCurrentAddress] = useState(0);
    const [project, setProject] = useState(null);
    const { param } = useParams();
    const [listWithdraw, setListWithdraw] = useState([]);
    const [chainId, setChainId] = useState(null);
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
            setChainId(chainid)
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
            try {
                const project = await getProjectDetail(signer, param)
                setProject(project)
            } catch {
                setProject(data_sample[Number(param)])
            }
            await getAddress()
            try {
                const listWithdraw = await getListWithdrawProject(provider.getSigner(), param)
                console.log(listWithdraw);
                setListWithdraw(listWithdraw)
            } catch { }

            // const listOrganization = await getOrganizationsProject(signer)
        }
        init()

    }, [provider, chainId]);

    return (
        <>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 flex justify-between ">
                    <div className="flex items-center">
                        <a href="/">
                            <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                        </a>
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-4 text-lg' href='/'>TRANG CHỦ</a>
                        <a style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' href='/projects'> CÁC DỰ ÁN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/profile'>THÔNG TIN CỦA BẠN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/about'>VỀ CHÚNG TÔI</a>
                        {/* <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
            </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-28'>
                <div className="flex px-5 xl:px-38 md:px-16 sm:px-16">
                    <div className="mx-10">
                        <div className="border-t-4 border-green-700 pt-8">
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    display: "flex",
                                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                                    color: (theme) =>
                                        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                    p: 1,
                                    m: 1,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                }}
                            >
                                <img style={{ width: 700 }} src={project && project.imageUrl} alt="Nature slice" />
                                <div className='flex flex-col'>
                                    <h1 className="text-3xl mx-6 my-6 text-center">{project && project.title}</h1>
                                    <div className="mx-8 text-base">
                                        {project && project.objective}
                                    </div>
                                </div>
                            </Box>
                        </div>
                        <div className='flex mt-8'>
                            <div className='border-t-4 border-green-700 flex-1 mr-5 px-5'>
                                <h2 className='my-6 text-xl font-bold'>Lịch sử rút USDT</h2>
                                {listWithdraw.length > 0 ? <div>
                                    <div className='pt-4 pb-1 flex justify-center border-gray-300'
                                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                    >
                                        <p className='w-64 text-lg font-bold text-center'>Số tiền</p>
                                        <p className='w-80 text-lg font-bold text-center'>Thời điểm</p>
                                        <p className='w-80 text-lg font-bold text-center'>Nội dung rút</p>
                                        <p className='w-80 text-lg font-bold text-center'>Biên lại</p>
                                    </div>
                                    {listWithdraw.map((item, index) => {
                                        return <div
                                            key={index}
                                            className='p-3 flex border-gray-300'
                                            style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                        >
                                            <p className='w-60 text-green-700 font-medium text-md text-center flex items-center justify-center'>{convertBigNumber(item.amount).toFixed(4)} USD</p>
                                            <p className='w-80 text-green-700 font-medium text-md text-center flex items-center justify-center'>{parseUnixTimeStamp(item.timestamp)}</p>
                                            <p className='w-80 mr-4 text-green-700 font-medium text-md flex items-center justify-start'>Quyên góp vì môi trường là một hoạt động quan trọng và cần thiết trong việc bảo vệ và cải thiện môi trường sống tại Việt Nam. Việt Nam đang đối mặt với nhiều thách thức về môi trường, bao gồm ô nhiễm không khí, ô nhiễm nước, suy thoái đất đai và sự suy giảm của các nguồn tài nguyên thiên nhiên. Quyên góp vì môi trường có thể được hiểu là sự đóng góp tài chính, tài nguyên hoặc thời gian của cá nhân, tổ chức và cộng đồng để thúc đẩy các hoạt động bảo vệ môi trường và xây dựng một tương lai bền vững cho Việt Nam</p>
                                            <img className='w-52 ml-12' src="https://img.freepik.com/free-photo/girl-sky_1340-27755.jpg?w=2000" alt="Biên lai" />
                                        </div>
                                    })}
                                </div> :
                                    <div className='mt-6 text-center'>
                                        Chưa có thông tin
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default HistoryWithdraw;  