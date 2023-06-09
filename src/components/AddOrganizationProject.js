import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField } from '@mui/material';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";

const donationAbi = require('../DonationAbi')

function AddOrganizationProject({ signer }) {
  const [project, setProject] = useState(null);
  const { param } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [infoOrgani, setInfoOrgani] = useState(false)

  useEffect(() => {
    if (signer) {
      const init = async () => {
        const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
        const project = await donationContract.getProject(param);
        setProject(project)
      }
      init();
    }
  }, [signer]);

  const onSubmit = async data => {
    if (signer) {
      const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
      if (infoOrgani) {
        try {
          const donateTx = await donationContract.addOrganization(data.name, data.description, data.imageUrl, data.wallet)
          await donateTx.wait();
          toast.success("Thêm thông tin cho tổ chức thành công");
          window.location.href = `/project-detail/${param}`
        } catch {
          toast.error("Thêm thông tin cho tổ chức thất bại");
        }
      } else {
        try {
          const donateTx = await donationContract.addOrganizationWallet(param, data['wallet'])
          await donateTx.wait();
          toast.success("Thêm ví tổ chức cho dự án thành công");
          window.location.href = `/project-detail/${param}`
        } catch {
          toast.error("Thêm ví tổ chức cho dự án thất bại");
        }
      }
    }
  }

  return (
    <>
      <div className="fixed z-30 w-full bg-white shadow-xl">
        <div className="px-8 flex justify-between ">
          <div className="flex items-end">
            <Link to="/">
              <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
            </Link>
          </div>
          <div className="flex items-center">
            <Link className='mx-2 px-2 py-3 text-lg' to='/'>TRANG CHỦ</Link>
            <Link className='mx-2 px-2 py-3 text-lg' to='/projects'> CÁC DỰ ÁN</Link>
            <Link className='mx-2 px-2 py-3 text-lg' to='/profile'>THÔNG TIN CỦA BẠN</Link>
            <Link className='mx-2 px-2 py-3 text-lg' to='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</Link>
            <Link className='mx-2 px-2 py-3 text-lg' to='/about'>VỀ CHÚNG TÔI</Link>
          </div>
        </div>
      </div>
      <div className='relative sm:container mx-auto px-10 pt-32'>
        <div className="border-t-4 border-green-700 pt-8">
          <Box
            sx={{
              boxShadow: 2,
              display: "flex",
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              p: 1,
              m: 1,
              borderRadius: 2,
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            <img style={{ width: 700 }} src={project && project.imageUrl} alt="Nature slice" />
            <div className='flex flex-col'>
              <h1 className="text-3xl mx-6 my-6 text-center">{project && project.title}</h1>
              <div className="mx-8 text-base font-medium">
                {project && project.objective}
              </div>
            </div>
          </Box>
        </div>
        <div className='font-bold mt-6 text-xl text-center'>THÊM TỔ CHỨC MỚI VÀO DỰ ÁN</div>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            '& > :not(style)': { margin: '20px 0', display: 'block' },
          }}
          noValidate
          autoComplete="off"
        >
          <Accordion sx={{
            boxShadow: 0
          }}>
            <AccordionSummary
              onClick={() => { setInfoOrgani(!infoOrgani) }}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                padding: 0,
                '& > :not(style)': { margin: '0 0', display: 'block' },
              }}
            >
              <p style={{ textDecoration: 'underline' }} className='w-fit cursor-pointer mt-1 text-sm font-medium text-green-700'>Bạn có muốn thêm thông tin của tổ chức không?</p>
            </AccordionSummary>
            <AccordionDetails sx={{
              padding: 0,
            }}>
              <TextField color="success" {...register("name")} fullWidth id="outlined-basic" label="Tên tổ chức" variant="outlined" />
              <TextField sx={{ marginTop: 2 }} color="success" {...register("description")} fullWidth id="outlined-basic" label="Mô tả" variant="outlined" />
              <TextField sx={{ marginTop: 2 }} color="success" {...register("imageUrl")} fullWidth id="outlined-basic" label="Đường dẫn ảnh của tổ chức" variant="outlined" />
            </AccordionDetails>
          </Accordion>
          <TextField  {...register("wallet")} color="success" fullWidth id="outlined-basic" label="Ví tổ chức" variant="outlined" />
          <Button sx={{ marginTop: 4 }} color="success" type='submit' variant="contained">Thêm tổ chức vào dự án</Button>
        </Box>
      </div>
      <div className='py-8 px-44 h-82 bg-black mt-20'>
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

export default AddOrganizationProject;  