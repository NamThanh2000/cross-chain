import React from 'react';
import './Organization.css';
import { ImageList, ImageListItem } from '@mui/material';


const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
        author: '@arwinneil',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
    },
    {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
        cols: 2,
    },
];

const About = () => {
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
            <div className='relative pt-22 mb-20'>
                <div style={{ backgroundImage: `url(${'/background_home.png'})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '650px' }}
                    className="relative w-full h-650 flex items-center after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r after:from-black after:bg-opacity-10 after:to-transparent after:z-0">
                    <div className="absolute z-20 w-full flex flex-col items-center">
                        <h1 className=" text-white font-bold text-5xl">Về Chúng Tôi</h1>
                        {/* <p className="mt-2 text-white font-bold text1xl">Help protect the air you breathe, water you drink and places you call home.</p> */}
                    </div>
                </div>
                <div className="organization flex my-8 px-52 pb-10 border-gray-600" style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}>
                    <img className='w-1/3 h-full' src="https://nosewash.rohto.com.vn/wp-content/uploads/2022/03/o-nhiem-khong-khi-nguyen-nhan-va-mot-so-bien-phap-khac-phuc.jpg" alt="" />
                    <div className='ml-4'>
                        <h2 className="organization-heading">Tổ chức của chúng tôi</h2>
                        <p className="organization-description">Chào mừng bạn đến với tổ chức của chúng tôi! Chúng tôi cam kết tạo ra tác động tích cực đối với môi trường và thúc đẩy bền vững.</p>
                        <p className="organization-description">Đội ngũ của chúng tôi bao gồm những cá nhân đam mê, cam kết nâng cao nhận thức, thúc đẩy thay đổi và triển khai các sáng kiến thân thiện với môi trường.</p>
                        <p className="organization-description">Qua những nỗ lực cộng tác của chúng tôi, chúng tôi hướng đến việc tạo ra một hành tinh xanh và khỏe mạnh cho các thế hệ tương lai.</p>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='flex p-4'>
                        <div className='w-96 px-2 mt-4'>
                            <h2 className='text-2xl mb-6'>Nhiệm vụ của chúng ta</h2>
                            <div>
                                Để bảo tồn các vùng đất và vùng nước mà tất cả sự sống phụ thuộc vào.
                            </div>
                        </div>
                        <div className='px-2'>
                            <img className='w-96' src="./About-Us_Our-Mission_V1.jpg" alt="" />
                        </div>
                    </div>
                    <div className='flex p-4'>
                        <div className='px-2'>
                            <img className='w-96' src="./About-Us_Our-Vision_V1.jpg" alt="" />
                        </div>
                        <div className='w-96 px-2'>
                            <h2 className='text-2xl mb-6'>Tầm nhìn của chúng tôi</h2>
                            <div>
                                Một thế giới nơi sự đa dạng của cuộc sống phát triển và mọi người hành động để bảo tồn thiên nhiên vì lợi ích của chính nó và khả năng đáp ứng nhu cầu của chúng ta và làm phong phú thêm cuộc sống của chúng ta.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default About;