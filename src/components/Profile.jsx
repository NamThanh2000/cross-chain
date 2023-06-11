import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import React, { useEffect, useState } from 'react';
import { convertBigNumber, getListProjectMyDonate, getTotalProjectMyDonate, parseUnixTimeStamp } from '../utils';
import { Button } from '@mui/material';

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

const Profile = () => {
    const [provider, setProvider] = useState(null);
    const [listProjectMyDonate, setListProjectMyDonate] = useState(0);
    const [totalProjectMyDonate, setTotalProjectMyDonate] = useState(0);

    useEffect(() => {
        const init = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                console.error("Không tìm thấy MetaMask");
                return;
            }
            const provider = new Web3Provider(ethereumProvider);
            setProvider(provider)
        };
        init();
    }, []);

    useEffect(() => {
        const init = async () => {
            if (!provider) return;
            const signer = provider.getSigner()
            try {
                const listProjectMyDonate = await getListProjectMyDonate(signer)
                setListProjectMyDonate(listProjectMyDonate)

                const totalProjectMyDonate = await getTotalProjectMyDonate(signer)
                setTotalProjectMyDonate(totalProjectMyDonate)
            } catch { }
        }
        init()

    }, [provider]);
    return (
        <div>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 flex justify-between ">
                    <div className="flex items-center">
                        <a href="/">
                            <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                        </a>
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-4 text-lg' href='/'>TRANG CHỦ</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/projects'> CÁC DỰ ÁN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/organizations'>CÁC TỔ CHỨC</a>
                        <a style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' href='/profile'>THÔNG TIN CỦA BẠN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/about'>VỀ CHÚNG TÔI</a>
                        {/* <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
            </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-40 pt-20'>
                <h1 className='font-bold text-4xl text-center'>Thông tin của bạn</h1>
                <div className='mt-4 mb-2 flex flex-col items-center'>
                    <div className='flex'>
                        <p className='font-bold'>Tài khoản: </p>
                        <p style={{ "color": "#49A942" }} className='ml-2 font-bold'>0x63Bb4B859ddbdAE95103F632bee5098c47aE2461</p>
                    </div>
                    <div className='flex'>
                        <p className='font-bold'>Tổng số USDT bạn đã ủng hộ:</p>
                        <p style={{ "color": "#49A942" }} className='font-bold ml-2'>{convertBigNumber(totalProjectMyDonate).toFixed(4)}</p>
                    </div>
                </div>
                <div className='mt-8'>
                    <Button color="success" href='/organization-add' variant="outlined">Thêm Tổ Chức</Button>
                </div>
                <div className='mt-10'>
                    <div className='flex justify-between mb-12'>
                        <h1 className='font-bold text-2xl'>Danh sách các dự án bạn đã ủng hộ</h1>
                    </div>
                    {listProjectMyDonate && data_sample?.map((item) => {
                        return <div className='mt-5'>
                            <List component="nav" aria-label="main mailbox folders">
                                <ListItemButton
                                // onClick={(event) => handleListItemClick(event, 0)}
                                >
                                    <ListItemIcon>
                                        <img className='rounded' style={{ width: 200, height: 120, overflow: "hidden" }} src={item.imageUrl} alt="" />
                                    </ListItemIcon>
                                    <div className='ml-4'>
                                        <h2 className='font-bold text-lg'>{item.title}</h2>
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
                                </ListItemButton>
                            </List>
                        </div>
                    })}
                </div>
            </div>
            <div className='py-8 px-44 h-82 bg-black mt-16'>
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
        </div>
    );
};

export default Profile;