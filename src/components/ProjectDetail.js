// import { TabContext } from '@material-ui/lab';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaidIcon from '@mui/icons-material/Paid';
import CircularProgress from '@mui/joy/CircularProgress';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Button, CircularProgress as CircularProgressMui } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { convertToken, parseUnixTimeStamp } from '../utils';
import FormDonate from './FormDonate';

const donationAbi = require('../DonationAbi')

function ProjectDetail({ chainId, addressCurrent, signer, myBalance, myETHBalance, setIsOn }) {
    const [value, setValue] = useState("1");
    const [project, setProject] = useState(null);
    const { param } = useParams();
    const [listWithdraw, setListWithdraw] = useState([]);
    const [listOrganization, setListOrganization] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOrg, setIsOrg] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (chainId === 1) setValue("0")
        else if (chainId === 56) setValue("1")
    }, [chainId]);

    useEffect(() => {
        if (signer) {
            const init = async () => {
                setLoading(true)
                const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
                const project = await donationContract.getProject(param);
                try {
                    const listWithdraw = await donationContract.getWithdrawalHistory(param)
                    setListWithdraw(listWithdraw)
                } catch {}
                const listOrganization = await donationContract.getOrganizationsForProject(param)
                for (let org in listOrganization) {
                    if (org["organizationWallet"] === addressCurrent) setIsOrg(true);
                    break;
                }
                setProject(project)
                setListOrganization(listOrganization);
                setLoading(false)
            }
            init();
        }
    }, [signer]);

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
            <div className='relative sm:container mx-auto px-10 pt-28'>
                {loading ?
                    <div style={{ height: 480 }} className="flex justify-center items-center">
                        <CircularProgressMui color="success" />
                    </div> :
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
                                        <div className="mx-8 text-base font-medium">
                                            {project && project.objective}
                                        </div>
                                    </div>
                                </Box>
                            </div>
                            <div className='flex my-10 justify-between'>
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <TabContext value={value}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList 
                                                value={value}
                                                onChange={handleChange}
                                                variant="fullWidth"
                                                scrollButtons={false}
                                                aria-label="basic tabs example"
                                                TabIndicatorProps={{
                                                    style: {
                                                        backgroundColor: "#15803D"
                                                    },
                                                }}
                                                sx={{
                                                    ".Mui-selected": {
                                                        color: "green !important"
                                                    }
                                                }}
                                            >
                                                <Tab label="Crosschain ETH" value="0" />
                                                <Tab label="Quyên góp" value="1" />
                                                <Tab label="Lịch sử quyên góp" value="2" />
                                                {addressCurrent === process.env.REACT_APP_OWNING_ADDRESS &&
                                                    <Tab label="Rút tiền" value="3" />
                                                }
                                            </TabList>
                                        </Box>
                                        <FormDonate
                                            projectId={param}
                                            checkTab={value}
                                            addressCurrent={addressCurrent}
                                            project={project}
                                            isOrg={isOrg}
                                            myBalance={myBalance}
                                            myETHBalance={myETHBalance}
                                            signer={signer}
                                            setValue={setValue}
                                        />
                                    </TabContext >
                                </Box>
                                <div className='ml-16 flex flex-col items-center mt-12'>
                                    <div className="xl:mx-10 mx-4 md:mx-4 sm:mx-4">
                                        <div className="flex flex-col items-center">
                                            {project && project !== null &&
                                                (convertToken(project && project['totalDonations']) / convertToken(project && project['amount'])) * 100 > 100 ?
                                                <CircularProgress thickness={14} color='success' sx={{ '--CircularProgress-size': '160px' }} determinate value={100}>
                                                    {100}%
                                                </CircularProgress> :
                                                <CircularProgress
                                                    thickness={14}
                                                    color='success'
                                                    sx={{ '--CircularProgress-size': '160px' }}
                                                    size="lg"
                                                    determinate
                                                    value={(convertToken(project && project['totalDonations']) / convertToken(project && project['amount'])) * 100}
                                                >
                                                    {`${project ? (((convertToken(project && project['totalDonations']) / convertToken(project && project['amount'])) * 100).toFixed(1)) : 0}%`}
                                                </CircularProgress>
                                            }
                                        </div>
                                    </div>
                                    {project && <div className='mt-10'>
                                        <div className='text-center'>
                                            <PaidIcon sx={{ marginRight: '4px' }} color='success' />
                                            {convertToken(project['totalDonations']).toFixed(2)}/{convertToken(project['amount']).toFixed(2)}
                                            <span className='ml-1'>USDT</span>
                                        </div>
                                        <div className='mt-3'>
                                            <CalendarMonthIcon sx={{ marginRight: '4px' }} color='success' />
                                            {parseUnixTimeStamp(project && project['deadline'])}
                                        </div>
                                    </div>}
                                    {addressCurrent === process.env.REACT_APP_OWNING_ADDRESS &&
                                        <Tooltip className='mt-5 cursor-pointer' title="Quản trị">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="50"
                                                height="50"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                imageRendering="optimizeQuality"
                                                shapeRendering="geometricPrecision"
                                                textRendering="geometricPrecision"
                                                viewBox="0 0 512 512" id="administrator"
                                            >
                                                <path
                                                    fill="#666"
                                                    d="M211 180c-3 0-6-2-6-4 0-1-4-20 1-42 6-29 23-51 50-63 2-1 4-1 5 0 2 1 3 2 3 3 14 40 47 33 95 19 16-5 32-10 45-10 16-1 27 6 32 19 1 3-1 6-4 8-3 1-6-1-8-4-6-18-28-12-62-2-21 6-42 13-61 12-21-2-37-12-45-31-21 10-34 28-38 51-5 20-1 37-1 37 0 4-2 7-5 7-1 0-1 0-1 0zM506 511l-386 0c-4 0-6-3-6-6 0 0 0 0 0 0l0-65c0-4 0-51 83-82 5-2 9-4 13-5 16-6 21-8 40-21 1-1 2-8 0-17-1-3 1-6 4-7 3-1 7 1 8 4 2 9 3 25-5 30-20 14-27 16-43 22-4 2-8 3-13 5-40 15-58 33-66 46-9 14-9 24-9 25 0 0 0 0 0 0l0 59 374 0 0-59c0 0 0 0 0-1 0 0 0-11-11-26-9-14-31-34-77-48-21-7-24-9-40-21l-3-2c-7-5-8-19-5-29 0-3 4-5 7-5 3 1 5 4 4 8-2 8-1 15 1 16l3 2c15 11 17 13 37 19 95 31 96 83 96 87l0 65c0 3-3 6-6 6zm-130-178l0 0 0 0z"></path><path fill="#666" d="M369 320c0 0 0 0-1 0-3-1-5-4-4-7 1-5 3-11 8-15 8-7 22-24 29-59 0-2 1-4 3-4 0-1 20-9 23-24 1-9-4-20-16-32-2-2-3-5-1-7 30-56 10-94-12-116-37-37-100-50-121-39-5 3-7 7-6 12 1 2 0 4-1 5-1 2-2 2-4 3-32 2-53 13-63 31-22 40 13 103 13 104 1 2 1 5-1 7-13 12-18 23-16 32 3 15 22 23 22 24 2 0 3 2 4 4 7 35 21 52 29 59 4 4 6 10 8 14 1 3-1 7-5 8-3 1-6-1-7-5-1-3-3-7-4-8-9-8-25-26-32-63-7-3-24-13-27-31-2-12 3-26 16-40-7-15-32-71-11-110 11-21 34-34 67-38 0-8 4-14 12-19 13-7 37-7 63 1 28 8 54 22 72 41 17 16 27 35 30 55 3 22-1 46-14 70 13 14 19 28 16 40-3 18-19 28-26 31-8 37-24 55-33 63-1 1-3 5-4 9 0 3-3 4-6 4zM313 364c-30 0-59-3-82-8-3-1-5-4-4-7 1-3 4-5 7-5 22 5 50 8 79 8 28 0 56-3 78-8 3 0 6 2 7 5 0 3-2 6-5 7-22 5-51 8-80 8z"></path><path fill="#666" d="M244 469c-1,0 -1,0 -2,0 -2,0 -3,-2 -4,-3l-41 -102c-1,-3 0,-6 3,-8 3,-1 7,1 8,4l38 93 58 -48 -44 -45c-2,-3 -2,-7 1,-9 2,-2 6,-2 8,0l48 51c1,1 2,2 2,4 -1,2 -1,3 -3,4l-69 58c-1,1 -2,1 -3,1z"></path><path fill="#666" d="M382 469c-2 0-3 0-4-1l-69-57c-1-2-2-3-2-5 0-1 0-3 1-4l48-51c3-2 6-2 9 0 2 2 2 6 0 9l-44 45 58 49 38-94c2-3 5-5 8-3 3 1 5 4 3 7l-41 102c0 1-2 3-4 3 0 0-1 0-1 0zM314 328c-21 0-41-3-60-8-3-1-5-5-4-8 1-3 4-5 8-4 17 5 36 8 56 8 19 0 37-2 54-7 3-1 6 1 7 4 1 3-1 6-4 7-18 5-37 8-57 8z"></path><path fill="#666" d="M339 460l-52 0c-2,0 -4,-1 -5,-2l-12 -16c-2,-3 -2,-7 1,-9 2,-2 6,-1 8,1l11 14 46 0 11 -14c2,-2 5,-3 8,-1 3,2 3,6 1,9l-12 16c-2,1 -3,2 -5,2z"></path><path fill="#666" d="M292 511c-3,0 -6,-2 -6,-5l-5 -51c-1,-2 0,-4 1,-5 1,-1 3,-2 5,-2l52 0c2,0 3,1 4,2 2,1 2,3 2,5l-6 51c0,3 -3,5 -6,5 -3,0 -6,-3 -5,-7l4 -44 -39 0 5 44c0,4 -2,6 -5,7 -1,0 -1,0 -1,0z"></path><path fill="#ffb300" d="M115 375l-40 0c-3,0 -6,-2 -6,-6l0 -20c-8,-3 -15,-8 -22,-13l-18 10c-3,2 -6,1 -8,-2l-20 -35c-1,-1 -1,-3 -1,-4 1,-2 2,-3 3,-4l18 -10c0,-4 -1,-9 -1,-13 0,-4 1,-8 1,-13l-18 -10c-1,-1 -2,-2 -3,-4 0,-1 0,-3 1,-4l20 -35c2,-3 5,-4 8,-2l18 10c7,-5 14,-10 22,-12l0 -21c0,-4 3,-6 6,-6l40 0c4,0 6,2 6,6l0 21c8,3 16,7 22,12l18 -10c3,-2 7,-1 9,2l20 35c0,1 1,3 0,4 0,2 -1,3 -3,4l-18 10c1,4 2,9 2,13 0,4 -1,8 -2,13l18 10c2,1 3,2 3,4 1,1 0,3 0,4l-20 35c-2,3 -6,4 -9,2l-18 -10c-6,5 -14,10 -22,12l0 21c0,4 -2,6 -6,6zm-20 -51c-25,0 -45,-21 -45,-46 0,-25 20,-46 45,-46 26,0 46,21 46,46 0,25 -20,46 -46,46zm0 -80c-18,0 -33,16 -33,34 0,19 15,34 33,34 19,0 34,-15 34,-34 0,-19 -15,-34 -34,-34z"
                                                    >
                                                </path>
                                            </svg>
                                        </Tooltip>
                                    }
                                    {isOrg &&
                                        <Tooltip className='mt-5 cursor-pointer' title="Tổ chức">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                dataName="Layer 1"
                                                viewBox="0 0 64 64"
                                                id="leadership"
                                                width="50"
                                                height="50"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                imageRendering="optimizeQuality"
                                                shapeRendering="geometricPrecision"
                                                textRendering="geometricPrecision"
                                            >
                                                <circle cx="13" cy="23" r="10" fill="#fff"></circle>
                                                <path d="M13 13a9.85 9.85 0 0 0-2.5.33 10 10 0 0 1 0 19.34A9.85 9.85 0 0 0 13 33a10 10 0 0 0 0-20Z" opacity=".1"></path>
                                                <path fill="#fff" d="M22 57H4a2 2 0 0 1-2-2V43a6 6 0 0 1 6-6h10a6 6 0 0 1 6 6v12a2 2 0 0 1-2 2Z"></path>
                                                <path d="M18 37h-5a6 6 0 0 1 6 6v12a2 2 0 0 1-2 2h5a2 2 0 0 0 2-2V43a6 6 0 0 0-6-6Z" opacity=".1"></path>
                                                <path fill="#fff" d="M46 37h10a6 6 0 0 1 6 6v12a2 2 0 0 1-2 2H42a2 2 0 0 1-2-2V43a6 6 0 0 1 6-6Z"></path>
                                                <circle cx="51" cy="23" r="10" fill="#fff"></circle><circle cx="32" cy="16" r="13" fill="#b4f78d"></circle>
                                                <path fill="#b4f78d" d="M26 33h12a6 6 0 0 1 6 6v16a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2V39a6 6 0 0 1 6-6Z"></path>
                                                <path d="M56 37h-5a6 6 0 0 1 6 6v12a2 2 0 0 1-2 2h5a2 2 0 0 0 2-2V43a6 6 0 0 0-6-6zm-5-24a9.85 9.85 0 0 0-2.5.33 10 10 0 0 1 0 19.34A9.85 9.85 0 0 0 51 33a10 10 0 0 0 0-20zM15 38.11h3.56v17.81H15zM32 3a12.85 12.85 0 0 0-2.5.25 13 13 0 0 1 0 25.5A12.85 12.85 0 0 0 32 29a13 13 0 0 0 0-26zm6 30h-5a6 6 0 0 1 6 6v16a2 2 0 0 1-2 2h5a2 2 0 0 0 2-2V39a6 6 0 0 0-6-6z" opacity=".1"></path><path fill="#4d4d4d" d="M23.68 28.47a14.95 14.95 0 0 0 16.64 0 12 12 0 1 0 6.1-16.54 15 15 0 0 0-28.84 0 12 12 0 1 0 6.1 16.54ZM59 23a8 8 0 0 1-15.54 2.65A14.94 14.94 0 0 0 47 16.09 8 8 0 0 1 59 23ZM32 5a11 11 0 1 1-11 11A11 11 0 0 1 32 5ZM13 31a8 8 0 1 1 4-14.91 14.94 14.94 0 0 0 3.54 9.56A8 8 0 0 1 13 31Z"></path><path fill="#4d4d4d" d="M56 35H46a7.28 7.28 0 0 0-1 .08A8 8 0 0 0 38 31H26a8 8 0 0 0-7 4.08 7.28 7.28 0 0 0-1-.08H8a8 8 0 0 0-8 8v12a4 4 0 0 0 4 4h56a4 4 0 0 0 4-4V43a8 8 0 0 0-8-8Zm-34 4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v16H22ZM4 55V43a4 4 0 0 1 4-4h10v16Zm56 0H46V39h10a4 4 0 0 1 4 4Z"></path>
                                                <circle cx="32" cy="41" r="2" fill="#fff"></circle>
                                            </svg>
                                        </Tooltip>
                                    }
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='border-t-4 border-green-700 flex-1 mr-5 px-5'>
                                    <h2 className='my-6 text-xl font-bold'>Lịch sử rút USDT</h2>
                                    {listWithdraw.length > 0 ? <div>
                                        <div className='pt-4 pb-1 flex justify-center border-gray-300'
                                            style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                        >
                                            <p className='w-64 text-lg font-bold text-center'>Số tiền</p>
                                            <p className='w-80 text-lg font-bold text-center'>Thời điểm</p>
                                        </div>
                                        {listWithdraw.map((item, index) => {
                                            return <div
                                                key={index}
                                                className='p-3 flex justify-center border-gray-300'
                                                style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                            >
                                                <p className='w-64 text-green-700 font-medium text-md text-center'>{convertToken(item.amount).toFixed(2)} USD</p>
                                                <p className='w-80 text-green-700 font-medium text-md text-center'>{parseUnixTimeStamp(item.timestamp)}</p>
                                            </div>
                                        })}

                                        <div className='flex justify-end mt-10 text-green-700'>
                                            <Link className='text-sm flex items-center' style={{ textDecoration: 'underline' }} to={`/history-withdraw/${param}`}>Chi tiết lịch sử rút
                                                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                                            </Link>
                                        </div>
                                    </div> :
                                        <div className='mt-6 text-center'>
                                            Chưa có thông tin
                                        </div>
                                    }
                                </div>
                                <div className="border-t-4 border-green-700 mb-10 flex-1 ml-5 px-5">
                                    <div className='my-6 flex justify-between items-center'>
                                        <h2 className='text-xl font-bold'>Các Tổ Chức Cùng Đồng Hành</h2>
                                        {addressCurrent === process.env.REACT_APP_OWNING_ADDRESS &&
                                            <Button color="success" variant="outlined"><Link to={`/organization-add-project/${param}`}>Thêm Tổ Chức</Link></Button>
                                        }
                                    </div>
                                    {listOrganization.length !== 0 ? listOrganization?.map((item, index) => {
                                        return <Accordion key={index}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="button">WWF Vietnam</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <div className='flex flex-col items-center'>
                                                        <img style={{ height: 86 }} className='mb-5' src="https://cdnassets.panda.org/_skins/international/img/logo.png" alt="" />
                                                        <Typography>
                                                            Tổ chức Quốc tế về Bảo tồn Thiên nhiên tại Việt Nam (WWF-Việt Nam) là một trong những tổ chức bảo tồn hàng đầu tại Việt Nam, tư vấn các giải pháp và hỗ trợ chính phủ và các đối tác giải quyết các thách thức của quá trình phát triển quốc gia.
                                                        </Typography>
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    }) : <div className='text-center'>Chưa có tổ chức nào</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className='py-8 px-44 h-82 bg-black mt-20'>
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

export default ProjectDetail;  