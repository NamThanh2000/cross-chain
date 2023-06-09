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

const data_sample = [
    {
        projectId: 0,
        imageUrl: "https://o.rada.vn/data/image/2021/08/02/viec-lam-bao-ve-moi-truong.jpg",
        title: "Quyên góp hỗ trợ trồng cây vì môi trường",
        objective: "Quyên góp vì môi trường là một hoạt động quan trọng và cần thiết trong việc bảo vệ và cải thiện môi trường sống tại Việt Nam. Việt Nam đang đối mặt với nhiều thách thức về môi trường, bao gồm ô nhiễm không khí, ô nhiễm nước, suy thoái đất đai và sự suy giảm của các nguồn tài nguyên thiên nhiên. Quyên góp vì môi trường có thể được hiểu là sự đóng góp tài chính, tài nguyên hoặc thời gian của cá nhân, tổ chức và cộng đồng để thúc đẩy các hoạt động bảo vệ môi trường và xây dựng một tương lai bền vững cho Việt Nam",
        amount: "1000000000000000000000",
        totalDonations: "700100000000000000000",
        deadline: "1688116926"
    },
    {
        projectId: 1,
        imageUrl: "https://ktmt.vnmediacdn.com/images/2022/11/14/67-1668436234-nganh-cong-nghiep-nhien-lieu-hoa-thach-phai-ngung-hoat-dong.jpg",
        title: "Cải thiện bộ phận xử lý khí đốt",
        objective: "Nhiều nhà phê bình cũng chỉ ra rằng việc khuyến khích các dự án khí đốt tự nhiên mới sẽ cản trở nghiêm trọng mục tiêu cắt giảm 55% lượng khí thải CO2 của EU vào cuối thập kỷ này, đi ngược lại với khuyến nghị của IPCC rằng thế giới cần ngừng xây dựng tất cả các dự án nhiên liệu hóa thạch mới về cơ bản ngay bây giờ, và có thể tước đi nguồn tài chính cần thiết của các dự án điện gió, điện mặt trời và các dự án năng lượng tái tạo khác.",
        amount: "500000000000000000000000",
        totalDonations: "8002300000000000000000",
        deadline: "1746004926"
    },
    {
        projectId: 2,
        imageUrl: "https://media.tapchitaichinh.vn/w1480/images/upload/vantruongtc/10272022/o-nhiem-khoi-bui.jpg",
        title: "Quyên góp cho việc lọc sạch không khí ô nhiễm vì phương tiện giao thông",
        objective: "Trong hoạt động giao thông, điểm cần nhắc đến trước hết là phương tiện cá nhân, trong đó chủ yếu xe máy là nguồn phát thải rất lớn do chưa kiểm định được phương tiện giống như ô tô. Xe máy cũ hầu như vẫn lưu thông, chưa bị siết. Bên cạnh đó, tiêu chuẩn khí thải áp dụng cho xe máy mới ở nước ta cũng mới là Euro 3, không phải là tiêu chuẩn cao. Trong khi đó, tại nhiều nước trên thế giới, tiêu chuẩn khí thải cũng cao hơn, và phương tiện được kiểm định thường xuyên, có niên hạn sử dụng.",
        amount: "10700000000000000000000",
        totalDonations: "800023000000000000000",
        deadline: "1719825726"
    },
    {
        projectId: 3,
        imageUrl: "https://phapluatmoitruong.vn/wp-content/uploads/2021/09/1-524.jpg",
        title: "Ủng hộ việc làm sạch rác ở các bãi biển",
        objective: "Tại huyện đảo Cô Tô (tỉnh Quảng Ninh), theo ước tính, mỗi ngày lượng rác thải sinh hoạt phát sinh khoảng 8 – 10 tấn, chủ yếu là chất thải rắn sinh hoạt. Lượng rác thải thu gom trên huyện đảo này hiện mới đạt mức 6 – 8 tấn/ngày, trong đó phần lớn là rác thải sinh hoạt. Nguồn rác thải từ các hộ gia đình, chợ, khách sạn… được tập kết về bãi rác Voòng Xi (thuộc khu 4, thị trấn Cô Tô) để chôn lấp. Số rác thải trên chủ yếu mới được thu gom tập trung ở các tuyến đường trung tâm thị trấn. Trong khi đó, một số khu vực như xã Thanh Lân, Đồng Tiến và các bãi biển có đông khách du lịch, việc thu gom rác thải lại rất hạn chế.",
        amount: "4000000000000000000000",
        totalDonations: "995203000000000000000",
        deadline: "1731921726"
    },
    {
        projectId: 4,
        imageUrl: "https://btnmt.1cdn.vn/2023/02/20/anh1.jpg",
        title: "Chung tay bảo vệ môi trường nước ở sông ngòi",
        objective: "Hiện tượng cá chết nổi trắng Hồ Tây suốt thời gian dài qua không chỉ ảnh hưởng tới môi trường, mỹ quan đô thị mà cuộc sống nhiều hộ dân xung quanh Hồ Tây, nhất là trên tuyến đường Trích Sài và Nguyễn Đình Thi bị ảnh hưởng nặng nề. Nhiều hộ kinh doanh hàng ăn, cafe giải khát tại đường Trích Sài cho biết, khoảng 1 tháng trở lại đây, việc kinh doanh của họ bị ảnh hưởng nghiêm trọng, lượng khách sụt giảm đáng kể vì cá chết bốc mùi hôi thối, tanh tưởi nồng nặc khiến nhiều người ngại tới đây ăn uống, vui chơi.",
        amount: "10000000000000000000000",
        totalDonations: "6052203000000000000000",
        deadline: "1717233726"
    },
    {
        projectId: 5,
        imageUrl: "https://vietthaisinh.com/wp-content/uploads/2021/11/o-nhiem-moi-truong.jpg",
        title: "Hạn chế thải nước thải chưa qua xử lý ra xuống sông ngòi",
        objective: "Ô nhiễm môi trường nước là vấn đề cấp bách và đòi hỏi sự tham gia của toàn xã hội, từ các nhà khoa học, quản lý môi trường cho đến công chúng. Những ảnh về ô nhiễm môi trường nước và giải pháp khắc phục chính là tín hiệu tích cực, khơi gợi và truyền tải thông điệp về việc bảo vệ môi trường. Hãy cùng nhau đóng góp cho một môi trường trong lành và bền vững hơn.",
        amount: "15000000000000000000000",
        totalDonations: "6052203000000000000000",
        deadline: "1830331326"
    },
    {
        projectId: 6,
        imageUrl: "https://photo-mekongasean.epicdn.me/w950/Uploaded/2023/tmgtng/2022_07_16/logo-broader1-7290.jpeg",
        title: "Quyên góp ủng hộ bộ phận sản xuất những đò dùng có thể tái chế",
        objective: "Trong bối cảnh đó, khái niệm kinh tế tuần hoàn đã được ra đời với mục tiêu xây dựng một hệ thống công nghiệp có thể phục hồi hoặc tái tạo theo ý định. Điều này cũng tương đương với việc khái niệm “kết thúc vòng đời sử dụng” sẽ bị loại bỏ hoàn toàn và khái niệm 'sử dụng năng lượng tái tạo' sẽ lên ngôi.",
        amount: "25000000000000000000000",
        totalDonations: "6052203000000000000000",
        deadline: "1742030526"
    }
]

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