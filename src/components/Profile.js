import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { convertToken, parseUnixTimeStamp } from '../utils';

const donationAbi = require('../DonationAbi')

function Profile({ signer }) {
    const [listProjectMyDonate, setListProjectMyDonate] = useState([]);
    const [totalProjectMyDonate, setTotalProjectMyDonate] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            if (signer) {
                const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
                const listProjectMyDonate = await donationContract.getDonatedProjects()
                setListProjectMyDonate(listProjectMyDonate)
                const totalProjectMyDonate = await donationContract.getTotalDonation()
                setTotalProjectMyDonate(totalProjectMyDonate)
                setLoading(false)
            }
        }
        init()
    }, [signer]);

    return (
        <div>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 flex justify-between ">
                    <div className="flex items-center">
                        <Link to="/">
                            <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link className='mx-2 px-2 py-4 text-lg' to='/'>TRANG CHỦ</Link>
                        <Link className='mx-2 px-2 py-4 text-lg' to='/projects'> CÁC DỰ ÁN</Link>
                        <Link style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' to='/profile'>THÔNG TIN CỦA BẠN</Link>
                        <Link className='mx-2 px-2 py-4 text-lg' to='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</Link>
                        <Link className='mx-2 px-2 py-4 text-lg' to='/about'>VỀ CHÚNG TÔI</Link>
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-40 pt-20'>
                {loading ?
                    <div style={{ height: 480 }} className="flex justify-center items-center">
                        <CircularProgress color="success" />
                    </div> :
                    <div>
                        <h1 className='font-bold text-4xl text-center'>Thông tin của bạn</h1>
                        <div className='mt-4 mb-2 flex flex-col items-center'>
                            <div className='flex'>
                                <p className='font-bold'>Tài khoản: </p>
                                <p style={{ "color": "#49A942" }} className='ml-2 font-bold'>{process.env.REACT_APP_OWNING_ADDRESS}</p>
                            </div>
                            <div className='flex'>
                                <p className='font-bold'>Tổng số USDT bạn đã ủng hộ:</p>
                                <p style={{ "color": "#49A942" }} className='font-bold ml-2'>{convertToken(totalProjectMyDonate).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <div className='flex justify-between mb-12'>
                                <h1 className='font-bold text-2xl'>Danh sách các dự án bạn đã ủng hộ</h1>
                            </div>
                            {listProjectMyDonate && listProjectMyDonate?.map((item, index) => {
                                return <Link key={index} className='mt-5' to={`/project-detail/${item.projectId}`}>
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <img className='rounded' style={{ width: 200, height: 120, overflow: "hidden" }} src={item.imageUrl} alt="" />
                                            </ListItemIcon>
                                            <div className='ml-4'>
                                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                                <div>
                                                    <div>Mục tiêu: <span style={{ color: "green" }}>{convertToken(item.amount)} USD</span></div>
                                                    <div className='flex'>
                                                        <p>Tiến độ:</p>
                                                        <p className='ml-2' style={{ color: "green" }}>
                                                            {((convertToken(item.totalDonations) / convertToken(item.amount)) * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                    <div>Thời điểm ngừng kêu gọi: <span style={{ color: "green" }}>{parseUnixTimeStamp(item.deadline)}</span></div>
                                                </div>
                                            </div>
                                        </ListItemButton>
                                    </List>
                                </Link>
                            })}
                        </div>
                    </div>
                }
            </div>
            <div className='py-8 px-44 h-82 bg-black mt-16'>
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
        </div>
    );
};

export default Profile;