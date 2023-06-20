import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Link, useParams } from "react-router-dom";
import { convertId, convertToken, parseUnixTimeStamp } from "../utils";

const donationAbi = require('../DonationAbi')

function HistoryWithdraw({ signer }) {
  const [project, setProject] = useState(null);
  const { param } = useParams();
  const [listWithdraw, setListWithdraw] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (signer) {
      const init = async () => {
        setLoading(true)
        const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
        const getProject = await donationContract.getProject(param);
        try {
          const getlistWithdraw = await donationContract.getWithdrawalHistory(param)
          setListWithdraw(getlistWithdraw);
        } catch {}
        setProject(getProject);
        
        setLoading(false)
      };
      init();
    }
  }, [signer]);

  const handleSaveImage = async (withdrawalId) => {
    const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
    const getImages = await donationContract.getWithdrawImage(param, convertId(withdrawalId));
    if (getImages.length > 0) {
      for (let imageUrl of getImages) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "withdraw";
        link.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success("Tải biên lai thành công");
    } else {
      toast.error("Chưa có ảnh biên lai nào được tải lên");
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
            <Link className="mx-2 px-2 py-4 text-lg" to="/">
              TRANG CHỦ
            </Link>
            <Link
              style={{ color: "#15803D" }}
              className="mx-2 px-2 py-4 text-lg"
              to="/projects"
            >
              {" "}
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
      <div className="relative sm:container mx-auto px-10 py-28">
        {loading ?
          <div style={{ height: 480 }} className="flex justify-center items-center">
            <CircularProgress color="success" />
          </div>
          : <div className="flex px-5 xl:px-38 md:px-16 sm:px-16">
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
                    <div className="mx-8 text-base font-medium">
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
                        className="pb-1 flex justify-center border-gray-300"
                        style={{
                          borderTop: "1px",
                          borderRight: "1px",
                          borderLeft: "1px",
                          borderWidth: "1px",
                        }}
                      >
                        <p className="w-96 text-lg font-bold text-center">
                          Địa chỉ ví nhận tiền
                        </p>
                        <p className="w-28 text-lg font-bold text-center">
                          Số USDT
                        </p>
                        <p className="w-44 text-lg font-bold text-center">
                          Thời điểm
                        </p>
                        <p className="w-80 text-lg font-bold text-center">
                          Nội dung rút
                        </p>
                        <p className="flex-1 text-lg font-bold text-center">
                          Biên lai
                        </p>
                      </div>
                      {listWithdraw.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex border-gray-300"
                            style={{
                              borderTop: "1px",
                              borderRight: "1px",
                              borderLeft: "1px",
                              borderWidth: "1px",
                            }}
                          >
                            <p className="w-96 text-green-700 font-medium text-md text-center flex items-center justify-center">
                              {item.transferWallet}
                            </p>
                            <p className="w-28 text-green-700 font-medium text-md text-center flex items-center justify-center">
                              {convertToken(item.amount).toFixed(2)}
                            </p>
                            <p className="w-44 text-green-700 font-medium text-md text-center flex items-center justify-center">
                              {parseUnixTimeStamp(item.timestamp)}
                            </p>
                            <p className="w-80 text-green-700 font-medium text-md flex items-center justify-start px-5">
                              {item.content}
                            </p>
                            <div className="flex items-center justify-center flex-1">
                              <Button
                                startIcon={<FileDownloadIcon />}
                                onClick={() => handleSaveImage(item.withdrawalId)}
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
        }
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

export default HistoryWithdraw;
