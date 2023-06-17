import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import About from "./components/About";
import AddOrganization from "./components/AddOrganization";
import AddOrganizationProject from "./components/AddOrganizationProject";
import AddProject from "./components/AddProject";
import ContactUs from "./components/ContactUs";
import Donate from './components/Donate';
import HistoryWithdraw from "./components/HistoryWithdraw";
import HomeLayout from "./components/HomeLayout";
import MyDonate from './components/MyDonate';
import Organizations from "./components/Organizations";
import Profile from "./components/Profile";
import Projects from "./components/Project";
import ProjectDetail from "./components/ProjectDetail";
import { lightTheme } from "./styles/theme/theme";
import { ethToBsc, getMyBalance } from "./utils";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 550,
  width: 750,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 2
};

function App() {
  const [provider, setProvider] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [amountCrossChain, setAmountCrossChain] = useState(null);
  const [myBalance, setMyBalance] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(0);
  const [btnDisable, setBtnDisable] = useState(false);

  useEffect(() => {
    
    const init = async () => {
      const ethereumProvider = await detectEthereumProvider();
      if (!ethereumProvider) {
        console.error("Không tìm thấy MetaMask");
        return;
      }
      const provider = new Web3Provider(ethereumProvider);
      const network = await provider.getNetwork();
      const chainid = network.chainId;
      if (chainid === 56) setOpen(false)
      else setOpen(true);

      ethereumProvider.on("chainChanged", () => {
        window.location.reload();
      });

      ethereumProvider.on("accountsChanged", () => {
        window.location.reload();
      });
    };

    init();
  }, []);

  useEffect(() => {
    if (!provider) return;
    setSigner(provider.getSigner());
    const getChainId = async () => {
        const network = await provider.getNetwork();
        const chainid = network.chainId;
        setChainId(chainid)
    }
    getChainId()
    const getMybalance = async () => {
        const balance = await getMyBalance(provider.getSigner(), provider)
        setMyBalance(balance)
    }
    getMybalance()
  }, [provider]);

  const closeModal = () => {
    const ethereumMainnet = {
      chainId: '0x38',
      chainName: 'Binance Smart Chain Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'], // RPC endpoint of BSC mainnet
      blockExplorerUrls: ['https://bscscan.com/'], // Block explorer URL of BSC mainnet
    };

    window.ethereum.request({ method: 'wallet_addEthereumChain', params: [ethereumMainnet] })
      .then(() => console.log('Ethereum mainnet added to Metamask'))
      .catch((error) => console.error(error));
  }

  const ethToBscHandle = async () => {
    if (Number(amountCrossChain) > Number(myBalance[0])) {
        toast.error("Your wallet is not enough to transfer");
    }
    else if (Number(amountCrossChain) < 0.007619) {
        toast.error("The crosschain amount must exceed 0.007619 ETH");
    }
    else {
        setBtnDisable(true)
        const donate = await ethToBsc(signer, provider, amountCrossChain)
        if (donate) {
            toast.success("Transfer success");
        }
        else {
            toast.error("Donate failed");
        }
        setBtnDisable(false)
    }
  }


  return (
    <div className="hehe">
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='p-6'>
                {1 && <div>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Chuyển ETH từ Mạng Ethereum sang Mạng Binance Smart Chain
                    </Typography>
                    <div className='flex items-center mt-5'>
                      <input
                            className='p-3 rounded'
                            // defaultValue={1}
                            value={amountCrossChain}
                            onChange={(e) => setAmountCrossChain(e.target.value)}
                            placeholder='Số BNB'
                            type='number'
                        />
                        <Button sx={{ marginLeft: 5 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={ethToBscHandle}>Quyên góp ngay bằng BNB</Button>
                    </div>
                    <p className='text-xs'>* Phí Crosschain là 0.00 %, Phí Gas là 0.000121 ETH</p>
                    <p className='text-xs'>* Số lượng nhỏ nhất để Crosschain là 0.007619 ETH</p>
                    <p className='text-xs'>* Số lượng lớn nhất để Crosschain là 3,174.6 ETH</p>
                    <p className='text-xs'>* Thời gian dự kiến để Crosschain là từ 10 đến 30 phút</p>
                    <p className='text-xs'>* Số lượng giao dịch Crosschain lớn hơn 634,92 ETH có thể mất đến 12 giờ</p>

                    {myBalance && <p className='my-2 text-sm italic'>Số dư BNB của bạn: <span className='font-bold' style={{ color: "#2E7D32" }}>{myBalance[0]} BNB</span></p>}
                </div>}
            </div>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Vui lòng chuyển sang mạng Binance Smart Chain
          </Typography> */}
          <Button onClick={closeModal} sx={{ marginTop: 5 }} variant="contained" color="success">
            Chuyển sang mạng BSC
          </Button>
        </Box>
      </Modal>
      <Toaster position="top-center" reverseOrder={true} />

      <ThemeProvider theme={lightTheme}>

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomeLayout />} />
            <Route path='/donate' element={<Donate />} />
            <Route path='/your-donate' element={<MyDonate />} />
            <Route path='/history-withdraw/:param' element={<HistoryWithdraw />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/project-detail/:param' element={<ProjectDetail />} />
            <Route path='/projects/add' element={<AddProject />} />
            <Route path='profile' element={<Profile />} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='/about' element={<About />} />
            <Route path='/organization-add' element={<AddOrganization />} />
            <Route path='/organization-add-project/:param' element={<AddOrganizationProject />} />
            <Route path='/organizations' element={<Organizations />} />

            {/* <Route path='*' element={<NotFound />} /> */}

          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    </div>
  );
}

export default App;
