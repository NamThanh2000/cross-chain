import React from 'react';
import { Link } from "react-router-dom";
import './Organization.css';


function About() {
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
            <Link className='mx-2 px-2 py-4 text-lg' to='/projects'> CÁC DỰ ÁN</Link>
            <Link className='mx-2 px-2 py-4 text-lg' to='/organizations'>CÁC TỔ CHỨC</Link>
            <Link className='mx-2 px-2 py-4 text-lg' to='/profile'>THÔNG TIN CỦA BẠN</Link>
            <Link className='mx-2 px-2 py-4 text-lg' to='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</Link>
            <Link style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' to='/about'>VỀ CHÚNG TÔI</Link>
          </div>
        </div>
      </div>
      <div className='relative pt-22 mb-20'>
        <div style={{ backgroundImage: `url(${'/background_home.png'})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '650px' }}
          className="relative w-full h-650 flex items-center after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r after:from-black after:bg-opacity-10 after:to-transparent after:z-0">
          <div className="absolute z-20 w-full flex flex-col items-center">
            <h1 className=" text-white font-bold text-5xl">Về Chúng Tôi</h1>
          </div>
        </div>
        <div className="organization flex px-52 py-20 border-gray-600" style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}>
          <img className='w-1/3 h-full rounded' src="./o-nhiem-khong-khi-nguyen-nhan-va-mot-so-bien-phap-khac-phuc.jpg" alt="" />
          <div className='ml-4' style={{ width: 700 }}>
            <h2 className="organization-heading">Tổ chức của chúng tôi</h2>
            <p className="organization-description">Chào mừng bạn đến với tổ chức của chúng tôi! Chúng tôi cam kết tạo ra tác động tích cực đối với môi trường và thúc đẩy bền vững.</p>
            <p className="organization-description">Đội ngũ của chúng tôi bao gồm những cá nhân đam mê, cam kết nâng cao nhận thức, thúc đẩy thay đổi và triển khai các sáng kiến thân thiện với môi trường.</p>
            <p className="organization-description">Qua những nỗ lực cộng tác của chúng tôi, chúng tôi hướng đến việc tạo ra một hành tinh xanh và khỏe mạnh cho các thế hệ tương lai.</p>
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <div className='flex p-4 py-20'>
            <div className='w-96 px-2 flex flex-col justify-center'>
              <h2 className='mb-6 organization-heading'>Nhiệm vụ của chúng ta</h2>
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
            <div className='w-96 px-2 flex flex-col justify-center'>
              <h2 className='text-2xl mb-6 organization-heading'>Tầm nhìn của chúng tôi</h2>
              <div>
                Một thế giới nơi sự đa dạng của cuộc sống phát triển và mọi người hành động để bảo tồn thiên nhiên vì lợi ích của chính nó và khả năng đáp ứng nhu cầu của chúng ta và làm phong phú thêm cuộc sống của chúng ta.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='py-8 px-44 h-82 bg-black'>
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
};

export default About;