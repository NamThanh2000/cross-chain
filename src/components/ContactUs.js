import { Link } from "react-router-dom";

function ContactUs() {
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
						<Link className='mx-2 px-2 py-4 text-lg' to='/profile'>THÔNG TIN CỦA BẠN</Link>
						<Link style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' to='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</Link>
						<Link className='mx-2 px-2 py-4 text-lg' to='/about'>VỀ CHÚNG TÔI</Link>
					</div>
				</div>
			</div>
			<div className='relative pt-22 mb-20'>
				<div style={{ backgroundImage: `url(${'/tnc_59935937.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '650px' }}
					className="relative w-full h-650 flex items-center">
					<div className="absolute z-20 w-full flex flex-col items-center">
						<h1 className=" text-white font-bold text-5xl">Liên Hệ Với Chúng Tôi</h1>
					</div>
				</div>
				<div className="flex justify-center px-4 mt-20">
					<iframe
						title='oceanover.tech'
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.234011576685!2d106.80257332546164!3d10.869797863081677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1686501116140!5m2!1svi!2s"
						width="640"
						height="400"
						style={{ border: 0 }}
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
					<div className="w-64 h-50 bg-gray-200 px-4 py-8 rounded">
						<h3 className="text-xl font-semibold text-center" style={{ color: "#1a1a1a" }}>Địa Chỉ</h3>
						<p className="mt-8 text-md text-center" style={{ color: "#1a1a1a", fontFamily: "sans-serif" }}>Đường Hàn Thuyên, khu phố 6 P, Thủ Đức, Thành phố Hồ Chí Minh</p>
					</div>
				</div>
				<div className="flex justify-center px-4 mt-20">
					<div className="w-64 h-50 bg-gray-200 px-4 py-8 mx-8 rounded">
						<h3 className="text-xl font-semibold text-center" style={{ color: "#1a1a1a" }}>Số Điện Thoại Liên Hệ</h3>
						<p className="mt-8 text-md text-center" style={{ color: "#1a1a1a", fontFamily: "sans-serif" }}><a href="tel:+84382893332">(+84) 382893332</a></p>
						<p className="mt-4 text-md text-center" style={{ color: "#1a1a1a", fontFamily: "sans-serif" }}><a href="tel:+84815102000">(+84) 815102000</a></p>
					</div>
					<div className="w-64 h-50 bg-gray-200 px-4 py-8 mx-8 rounded">
						<h3 className="text-xl font-semibold text-center" style={{ color: "#1a1a1a" }}>Địa Chỉ Email</h3>
						<p className="mt-8 text-md text-center" style={{ color: "#1a1a1a", fontFamily: "sans-serif" }}><a href="mailto:18520729@gm.uit.edu.vn">18520729@gm.uit.edu.vn</a></p>
						<p className="mt-4 text-md text-center" style={{ color: "#1a1a1a", fontFamily: "sans-serif" }}><a href="mailto:18521124@gm.uit.edu.vn">18521124@gm.uit.edu.vn</a></p>
					</div>
					<div className="w-64 h-50 bg-gray-200 px-4 py-8 mx-8 rounded">
						<h3 className="text-xl font-semibold text-center" style={{ color: "#1a1a1a" }}>Website</h3>
						<p className="mt-8 text-md text-center" style={{ color: "#1a1a1a", fontFamily: "sans-serif" }}><a href="/">oceanover.tech</a></p>
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
}

export default ContactUs;  