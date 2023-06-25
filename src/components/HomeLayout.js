import { Link } from "react-router-dom";

function HomeLayout({ isConnectMetamask }) {
  const connectMetamask = async () => {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Lỗi kết nối với MetaMask:", error);
    }
  };

  return (
    <>
      <div className="fixed z-30 w-full bg-white shadow-xl">
        <div className="px-8 flex justify-between ">
          <div className="flex items-center">
            <Link to="/">
              <img
                className="w-26 h-12 mr-10 text-gray-700"
                src="/350232362_194904190170121_8724430467209331448_n.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              style={{ color: "#15803D" }}
              className="mx-2 px-2 py-4 text-lg"
              to="/"
            >
              TRANG CHỦ
            </Link>
            <Link className="mx-2 px-2 py-4 text-lg" to="/projects">
              CÁC DỰ ÁN
            </Link>
            <Link className="mx-2 px-2 py-4 text-lg" to="/profile">
              THÔNG TIN CỦA BẠN
            </Link>
            <Link className="mx-2 px-2 py-4 text-lg" to="/contact-us">
              LIÊN HỆ VỚI CHÚNG TÔI
            </Link>
            <Link className="mx-2 px-2 py-4 text-lg" to="/about">
              VỀ CHÚNG TÔI
            </Link>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundImage: `url(${"/background_home.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "650px",
        }}
        className="relative w-full h-650 flex items-center after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r after:from-black after:bg-opacity-10 after:to-transparent after:z-0"
      >
        <div className="absolute z-20 lg:mx-60 mx-5">
          <h1 className=" text-white font-bold text-5xl">
            Bảo vệ những gì thiên nhiên ban tặng cho bạn
          </h1>
          <p className="mt-2 text-white font-bold text1xl">
            Hãy giúp bảo vệ không khí bạn hít thở, nước bạn uống và những nơi
            bạn gọi là nhà.
          </p>
          {!isConnectMetamask && (
            <button
              onClick={connectMetamask}
              className="mt-6 px-8 py-3 bg-white text-green-700 font-bold"
            >
              Kết nối ví MetaMask
            </button>
          )}
        </div>
      </div>
      <div className="sm:container mx-auto px-10 mt-10">
        <div
          className="lg:flex justify-center lg:py-20 border-gray-600"
          style={{
            borderTop: "1px",
            borderRight: "1px",
            borderLeft: "1px",
            borderWidth: "1px",
          }}
        >
          <div className="py-6 px-4 lg:w-4/5">
            <img className="w-90 h-full" src="./tnc_90495476_Full.jpg" alt="" />
          </div>
          <div className="grid lg:grid-cols-2 px-4 ">
            <div
              className="lg:mx-6 py-6 border-gray-600"
              style={{
                borderTop: "1px",
                borderRight: "1px",
                borderLeft: "1px",
                borderWidth: "1px",
              }}
            >
              <h3 className="text-2xl text-green-700 font-bold">
                Chúng tôi là ai
              </h3>
              <p className="mt-2">
                Chúng tôi là những nhân viên, nhà khoa học và thành viên tận tâm
                thúc đẩy hoạt động bảo tồn hiệu quả.
              </p>
            </div>
            <div
              className="lg:mx-6 py-6 border-gray-600"
              style={{
                borderTop: "1px",
                borderRight: "1px",
                borderLeft: "1px",
                borderWidth: "1px",
              }}
            >
              <h3 className="text-2xl text-green-700 font-bold">
                Chúng tôi làm gì
              </h3>
              <p className="mt-2">
                Để tạo ra tác động cao nhất có thể đối với khủng hoảng khí hậu
                và đa dạng sinh học từ nay đến năm 2030, chúng tôi đang phát
                triển các ý tưởng đột phá, khuếch đại các nhà lãnh đạo địa
                phương và tác động đến chính sách.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <h3 className="text-2xl text-green-700 font-bold">
                Làm thế nào để giúp đỡ
              </h3>
              <p className="mt-2">
                Có rất nhiều cách để tạo ra sự thay đổi tích cực cho hành tinh
                của chúng ta. Tình nguyện với chúng tôi. Tìm hiểu làm thế nào để
                giảm lượng khí thải carbon của bạn. Đóng góp cho công việc bảo
                tồn.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <h3 className="text-2xl text-green-700 font-bold">
                Nơi chúng tôi làm việc
              </h3>
              <p className="mt-2">
                Rừng nhiệt đới dày đặc, rạn san hô xa xôi và trung tâm của các
                thành phố lớn. Các chiến lược của chúng tôi cũng đa dạng như môi
                trường sống và khu vực địa lý nơi chúng tôi làm việc.
              </p>
            </div>
          </div>
        </div>
        <div className="my-20 lg:flex lg:items-center">
          <img src="/WOPA160517.jpg" alt="WOPA160517" />
          <div className="lg:ml-20">
            <p className="font-bold text-sm py-4">NHIỆM VỤ CỦA CHÚNG TA</p>
            <h2 className="text-5xl font-bold">
              Bảo tồn các vùng đất và vùng nước mà tất cả sự sống phụ thuộc vào
            </h2>
            <p className="py-8">
              Mỗi mẫu đất chúng tôi bảo vệ và mỗi dặm sông chúng tôi khôi phục
              đều bắt đầu với bạn. Sự hỗ trợ của bạn giúp chúng tôi đối phó với
              các mối đe dọa kép của biến đổi khí hậu và suy giảm đa dạng sinh
              học trên hơn 70 quốc gia và vùng lãnh thổ.
            </p>
            <Link to="/projects">
              <button className="px-8 py-3 bg-green-700 text-white font-bold">
                QUYÊN GÓP NGAY
              </button>
            </Link>
          </div>
        </div>
        <div className="lg:flex justify-center my-20">
          <div className="py-6 px-4" style={{ width: "80%" }}>
            <h2 className="text-3xl font-bold">
              Mục tiêu của chúng tôi cho năm 2030
            </h2>
            <p className="mt-3">
              Chúng tôi đang chạy đua để đạt được những mục tiêu này nhằm giúp
              thế giới đảo ngược tình trạng biến đổi khí hậu và suy giảm đa dạng
              sinh học. Cùng nhau, chúng ta tìm ra những con đường để biến sự
              thay đổi thành có thể.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 px-4 ">
            <div className="lg:mx-6 py-6">
              <div className="flex items-center">
                <img className="w-14" src="/Icon_CO2.svg" alt="Icon_CO2" />
                <h3 className="text-5xl font-bold ml-2">3B</h3>
              </div>
              <p className="mt-2">
                Tránh hoặc cô lập 3 tỷ tấn khí thải carbon dioxide hàng
                năm—tương đương với việc loại bỏ 650 triệu ô tô trên đường mỗi
                năm.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <div className="flex items-center">
                <img
                  className="w-14"
                  src="/Icon_People.svg"
                  alt="Icon_People"
                />
                <h3 className="text-5xl font-bold ml-2">100M</h3>
              </div>
              <p className="mt-2">
                Giúp 100 triệu người có nguy cơ nghiêm trọng trong các trường
                hợp khẩn cấp liên quan đến khí hậu bằng cách bảo vệ môi trường
                sống bảo vệ cộng đồng.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <div className="flex items-center">
                <img className="w-14" src="/Icon_Land.svg" alt="Icon_Land" />
                <h3 className="text-5xl font-bold ml-2">650M</h3>
              </div>
              <p className="mt-2">
                Bảo tồn 650 triệu ha—diện tích đất rộng gấp đôi Ấn Độ—của các
                môi trường sống đa dạng sinh học như rừng, đồng cỏ và sa mạc.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <div className="flex items-center">
                <img className="w-14" src="/Icon_Ocean.svg" alt="Icon_Ocean" />
                <h3 className="text-5xl font-bold ml-2">4B</h3>
              </div>
              <p className="mt-2">
                Bảo tồn 4 tỷ ha môi trường sống biển—hơn 10% diện tích đại dương
                trên thế giới—thông qua các khu bảo tồn, đánh bắt bền vững, v.v.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <div className="flex items-center">
                <img className="w-14" src="/Icon_River.svg" alt="Icon_River" />
                <h3 className="text-5xl font-bold ml-2">30M</h3>
              </div>
              <p className="mt-2">
                Bảo tồn 1 triệu km sông—đủ để kéo dài 25 lần vòng quanh thế
                giới—cùng với 30 triệu ha hồ và vùng đất ngập nước.
              </p>
            </div>
            <div className="lg:mx-6 py-6">
              <div className="flex items-center">
                <img
                  className="w-14"
                  src="/Icon_Partnership.svg"
                  alt="Icon_Partnership"
                />
                <h3 className="text-5xl font-bold ml-2">45M</h3>
              </div>
              <p className="mt-2">
                Hỗ trợ sự lãnh đạo của 45 triệu người từ các cộng đồng bản địa
                và địa phương trong việc quản lý môi trường của họ và đảm bảo
                các quyền.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 px-44 h-82 bg-black">
        <div>
          <div className="flex justify-around">
            <div className="">
              <div className="w-64">
                <Link to="/">
                  <img
                    className="w-26 h-12 mr-10 text-gray-700"
                    src="/350232362_194904190170121_8724430467209331448_n.png"
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="mt-4 text-white text-xs w-96">
                Chào mừng bạn đến với tổ chức quyên góp quỹ thiện nguyện! Chúng
                tôi cam kết xây dựng một thế giới tốt đẹp hơn thông qua những
                hành động thiện nguyện. Với sứ mệnh hỗ trợ cộng đồng và giúp đỡ
                những người gặp khó khăn, chúng tôi tập trung vào việc gây quỹ
                và chia sẻ tài nguyên để tạo ra những tác động tích cực. Hãy
                cùng nhau chung tay để thay đổi cuộc sống và lan tỏa tình yêu
                thương đến tất cả mọi người.
              </div>
              <div className="mt-8 text-white text-xs">
                © 2023-Quyên góp vì môi trường
              </div>
            </div>
            <div>
              <h3 className="text-white">Kết Nối</h3>
              <div className="mt-4">
                <div className="text-white text-xs">Giới thiệu</div>
                <div className="text-white text-xs mt-2">
                  Liên hệ với chúng tôi
                </div>
              </div>
            </div>
            <div>
              <h3 className=" text-white">Ủng Hộ</h3>
              <div className="mt-4">
                <div className="text-white text-xs">Dự án</div>
                <div className="text-white text-xs mt-2">Ủng hộ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeLayout;
