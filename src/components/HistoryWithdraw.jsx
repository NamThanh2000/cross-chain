import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    convertBigNumber,
    parseUnixTimeStamp
} from "../utils";


function HistoryWithdraw({ donationContract }) {
  const [project, setProject] = useState(null);
  const { param } = useParams();
  const [listWithdraw, setListWithdraw] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (donationContract) {
        const getProject = await donationContract.getProject(param);
        const getlistWithdraw = await donationContract.getWithdrawalHistory(param)
        setProject(getProject);
        setListWithdraw(getlistWithdraw);
      }
    };
    init();
  }, []);

  console.log(project);

  const handleSaveImage = async () => {
    let imageUrl =
      "https://o.rada.vn/data/image/2021/08/02/viec-lam-bao-ve-moi-truong.jpg";
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div className="fixed z-30 w-full bg-white shadow-xl">
        <div className="px-8 flex justify-between ">
          <div className="flex items-center">
            <a href="/">
              <img
                className="w-26 h-12 mr-10 text-gray-700"
                src="/350232362_194904190170121_8724430467209331448_n.png"
                alt="logo"
              />
            </a>
          </div>
          <div className="flex items-center">
            <a className="mx-2 px-2 py-4 text-lg" href="/">
              TRANG CHỦ
            </a>
            <a
              style={{ color: "#15803D" }}
              className="mx-2 px-2 py-4 text-lg"
              href="/projects"
            >
              {" "}
              CÁC DỰ ÁN
            </a>
            <a className="mx-2 px-2 py-4 text-lg" href="/profile">
              THÔNG TIN CỦA BẠN
            </a>
            <a className="mx-2 px-2 py-4 text-lg" href="/contact-us">
              LIÊN HỆ VỚI CHÚNG TÔI
            </a>
            <a className="mx-2 px-2 py-4 text-lg" href="/about">
              VỀ CHÚNG TÔI
            </a>
          </div>
        </div>
      </div>
      <div className="relative sm:container mx-auto px-10 py-28">
        <div className="flex px-5 xl:px-38 md:px-16 sm:px-16">
          <div className="mx-10">
            <div className="border-t-4 border-green-700 pt-8">
              <Box
                sx={{
                  boxShadow: 2,
                  display: "flex",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#101010" : "#fff",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "grey.300" : "grey.800",
                  p: 1,
                  m: 1,
                  borderRadius: 2,
                  textAlign: "center",
                  fontSize: "0.875rem",
                  fontWeight: "700",
                }}
              >
                <img
                  style={{ width: 700 }}
                  src={project && project.imageUrl}
                  alt="Nature slice"
                />
                <div className="flex flex-col">
                  <h1 className="text-3xl mx-6 my-6 text-center">
                    {project && project.title}
                  </h1>
                  <div className="mx-8 text-base">
                    {project && project.objective}
                  </div>
                </div>
              </Box>
            </div>
            <div className="flex mt-8">
              <div className="border-t-4 border-green-700 flex-1 mr-5 px-5">
                <h2 className="my-6 text-xl font-bold">Lịch sử rút USDT</h2>
                {listWithdraw && listWithdraw.length > 0 ? (
                  <div>
                    <div
                      className="pt-4 pb-1 flex justify-center border-gray-300"
                      style={{
                        borderTop: "1px",
                        borderRight: "1px",
                        borderLeft: "1px",
                        borderWidth: "1px",
                      }}
                    >
                      <p className="w-64 text-lg font-bold text-center">
                        Số tiền
                      </p>
                      <p className="w-80 text-lg font-bold text-center">
                        Thời điểm
                      </p>
                      <p className="w-80 text-lg font-bold text-center">
                        Nội dung rút
                      </p>
                      <p className="w-80 text-lg font-bold text-center">
                        Biên lai
                      </p>
                    </div>
                    {listWithdraw.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="p-3 flex border-gray-300"
                          style={{
                            borderTop: "1px",
                            borderRight: "1px",
                            borderLeft: "1px",
                            borderWidth: "1px",
                          }}
                        >
                          <p className="w-60 text-green-700 font-medium text-md text-center flex items-center justify-center">
                            {convertBigNumber(item.amount).toFixed(4)} USD
                          </p>
                          <p className="w-80 text-green-700 font-medium text-md text-center flex items-center justify-center">
                            {parseUnixTimeStamp(item.timestamp)}
                          </p>
                          <p className="w-80 mr-4 text-green-700 font-medium text-md flex items-center justify-start">
                            Quyên góp vì môi trường là một hoạt động quan trọng
                            và cần thiết trong việc bảo vệ và cải thiện môi
                            trường sống tại Việt Nam. Việt Nam đang đối mặt với
                            nhiều thách thức về môi trường, bao gồm ô nhiễm
                            không khí, ô nhiễm nước, suy thoái đất đai và sự suy
                            giảm của các nguồn tài nguyên thiên nhiên. Quyên góp
                            vì môi trường có thể được hiểu là sự đóng góp tài
                            chính, tài nguyên hoặc thời gian của cá nhân, tổ
                            chức và cộng đồng để thúc đẩy các hoạt động bảo vệ
                            môi trường và xây dựng một tương lai bền vững cho
                            Việt Nam
                          </p>
                          <div className="flex items-center justify-center w-1/4">
                            <Button
                              startIcon={<FileDownloadIcon />}
                              onClick={handleSaveImage}
                              color="success"
                            >
                              Tải ảnh biên lai
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 text-center">Chưa có thông tin</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 px-44 h-82 bg-black">
        <div>
          <div className="flex justify-around">
            <div className="">
              <div className="w-64">
                <a href="/">
                  <img
                    className="w-26 h-12 mr-10 text-gray-700"
                    src="/350232362_194904190170121_8724430467209331448_n.png"
                    alt="logo"
                  />
                </a>
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

export default HistoryWithdraw;
