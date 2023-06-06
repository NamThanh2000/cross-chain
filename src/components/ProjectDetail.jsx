import { Web3Provider } from '@ethersproject/providers';
import { Tab, Tabs } from '@material-ui/core';
import { TabContext } from '@material-ui/lab';
import detectEthereumProvider from "@metamask/detect-provider";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import { useParams } from 'react-router-dom';
import { convertBigNumber, getListWithdrawProject, getProjectDetail, parseUnixTimeStamp } from '../utils';
import FormDonate from './FormDonate';


function ProjectDetail() {
    const [provider, setProvider] = useState(null);
    const [value, setValue] = useState(0);
    const [currentAddress, setCurrentAddress] = useState(0);
    const [project, setProject] = useState(null);
    const { param } = useParams();
    const [listWithdraw, setListWithdraw] = useState([]);
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
            const listWithdraw = await getListWithdrawProject(provider.getSigner(), param)
            setListWithdraw(listWithdraw)
            // const listOrganization = await getOrganizationsProject(signer)
        }
        init()

    }, [provider]);

    console.log(project && (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100);
    console.log(project && (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100);

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
                        <a style={{ "color": "#49A942" }} className='mx-2 px-2 py-4 text-lg' href='/projects'> CÁC DỰ ÁN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/profile'>THÔNG TIN CỦA BẠN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/about'>VỀ CHÚNG TÔI</a>
                        {/* <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
            </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-20'>
                <div className="flex px-5 xl:px-38 md:px-16 sm:px-16 mt-15">
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
                                            <Tab label="Nền tảng Ethereum" value={0} />
                                            <Tab label="Nền tảng Binance smart chain" value={1} />
                                            <Tab label="Ủng hộ của bạn" value={2} />
                                            {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                                                <Tab label="Rút tiền" value={3} />
                                            }
                                        </Tabs>
                                    </Box>
                                </Box>
                                <FormDonate projectId={param} checkTab={Number(value)} />
                            </TabContext >
                        </div>
                        <div className='mt-10 border-t-4 border-green-700'>
                            <h2 className='text-2xl font-bold'>Lịch sử rút token</h2>
                            {listWithdraw.length > 0 ? <div>
                                <div className='pt-4 pb-1 flex justify-center border-gray-300'
                                    style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                >
                                    <p className='w-64 font-bold text-lg'>Amount</p>
                                    <p className='w-80 font-bold text-lg'>Timestamp</p>
                                </div>
                                {listWithdraw.map((item, index) => {
                                    return <div
                                        key={index}
                                        className='p-3 flex justify-center border-gray-300'
                                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                    >
                                        <p className='w-64 font-medium text-green-700 text-lg'>{convertBigNumber(item.amount).toFixed(4)} USD</p>
                                        <p className='w-80 font-medium text-green-700 text-lg'>{parseUnixTimeStamp(item.timestamp)}</p>
                                    </div>
                                })}
                            </div> :
                                <div className='mt-6 text-center'>
                                    Chưa có lịch sử rút nào
                                </div>
                            }

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
                        {/* <img className='h-56' src="/o-nhiem-3786.jpg" alt="NCM130311" /> */}
                        <div className="px-6 pt-6 flex flex-col items-center">
                            <h4 className="font-bold text-lg">Tiến độ đạt được</h4>
                            {project &&
                                (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100 > 100 ?

                                <CircularProgressbar className='w-44 mt-4' value='100' text={`100%`} /> :
                                <CircularProgressbar className='w-44 mt-4' value={(convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100} text={`${project ? (((convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100).toFixed(1)) : 0}%`} />

                            }

                        </div>
                    </div>
                </div>
            </div>
            <div className='py-8 px-44 h-82 bg-black'>
                <div>
                    <div className='flex justify-around'>
                        <div className=''>
                            <div className='w-64'>
                                <a href="/">
                                    <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                                </a>
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
                                <div className='text-white text-xs'>Liên hệ với chúng tôi</div>
                            </div>
                        </div>
                        <div>
                            <h3 className=' text-white'>Ủng Hộ</h3>
                            <div className='mt-4'>
                                <div className='text-white text-xs'>Dự án</div>
                                <div className='text-white text-xs'>Ủng hộ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default ProjectDetail;  