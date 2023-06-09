import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { convertBigNumber, convertProjectId, getAllProject, getListActiveProject, parseUnixTimeStamp } from '../utils';
import { data_sample } from '../dataSample'

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
                <div className='flex justify-between mb-10'>
                    <h1 className='font-bold text-3xl flex items-center'>Danh sách các dự án</h1>
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl color="success" fullWidth>
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
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                    <div className='flex justify-end mb-6'>
                        <Button color="success" href='/projects/add' variant="outlined">Thêm dự án mới</Button>
                    </div>
                }
                <div className='mb-20 px-24 flex flex-wrap'>
                    {data_sample?.map((item) => {
                        return <Card key={convertProjectId(item.projectId)} sx={{ maxWidth: 400, margin: "10px", height: "100%" }}>
                            <CardMedia
                                component="img"
                                alt="green iguana"
                                height="140"
                                image={item.imageUrl}
                                sx={{ maxWidth: 450, maxHeight: 209, overflow: "hidden" }}
                            />
                            <CardContent>
                                <Typography sx={{ height: 64 }} gutterBottom variant="h6" component="div">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <p 
                                        style={{ 
                                            display: "-webkit-box",
                                            "-webkit-line-clamp": "4",
                                            "-webkit-box-orient": "vertical",
                                            overflow: "hidden",
                                            "text-overflow": "ellipsis"
                                        }}
                                    >
                                        {item.objective}
                                    </p>
                                    <div className='mt-5'>
                                        <div>Mục tiêu: <span style={{ color: "#2E7D32" }} className='font-bold'>{convertBigNumber(item.amount) > 0.01 ? convertBigNumber(item.amount) : 0} USDT</span></div>
                                        <div>Tiến độ: <span style={{ color: "#2E7D32" }} className='font-bold'>
                                            {(convertBigNumber(item && item.totalDonations) / convertBigNumber(item && item.amount)) * 100 > 100 ?
                                                100 : ((convertBigNumber(item.totalDonations) / convertBigNumber(item.amount)) * 100).toFixed(1)
                                            }
                                            %
                                            </span>
                                        </div>
                                        <div>Ngày hết hạn: <span style={{ color: "#2E7D32" }} className='font-bold'>{parseUnixTimeStamp(item.deadline)}</span></div>
                                    </div>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button color="success" size="small"><a href={`project-detail/${convertProjectId(item.projectId)}`}>Quyên góp ngay</a></Button>
                            </CardActions>
                        </Card>
                    })}
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

export default Projects;  