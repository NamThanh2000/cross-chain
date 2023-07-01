import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { ethers } from 'ethers';
import Lottie from 'lottie-react-web';
import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import About from "./components/About";
import AddOrganizationProject from "./components/AddOrganizationProject";
import AddProject from "./components/AddProject";
import ContactUs from "./components/ContactUs";
import HistoryWithdraw from "./components/HistoryWithdraw";
import HomeLayout from "./components/HomeLayout";
import Profile from "./components/Profile";
import Projects from "./components/Project";
import ProjectDetail from "./components/ProjectDetail";
import { lightTheme } from "./styles/theme/theme";
import transcationIcon from './transcation-icon.json';
import { convertToken } from "./utils";

const wethAbi = require('./IERC20Abi')
const routerAbi = require('./RouterAbi')

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  py: 5,
  px: 8,
  borderRadius: 2
}

function App() {
  const [open, setOpen] = React.useState(false);
  const [amountCrossChain, setAmountCrossChain] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = React.useState(false);
  const [chainId, setChainId] = useState(null);
  const [btnDisable, setBtnDisable] = useState(false);
  const [addressCurrent, setAddressCurrent] = useState(null);
  const [ethereumProvider, setEthereumProvider] = useState(null)
  const [myETHBalance, setMyETHBalance] = useState(0);

  useEffect(() => {
    const init = async () => {
      const getEthereumProvider = await detectEthereumProvider();
      if (!getEthereumProvider) {
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
        return;
      }
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          return;
        }
      } catch (error) {
        return;
      }
      getEthereumProvider.on("chainChanged", () => {
        window.location.reload();
      });
      getEthereumProvider.on("accountsChanged", () => {
        window.location.reload();
      });
      setEthereumProvider(getEthereumProvider)
    };
    init();
  }, []);

  useEffect(() => {
    if (ethereumProvider) {
      const getProvider = new Web3Provider(ethereumProvider);
      const getSigner = getProvider.getSigner();
      setProvider(getProvider);
      setSigner(getSigner);
    }
  }, [ethereumProvider])

  useEffect(() => {
    const init = async () => {
      if (provider) {
        const getNetwork = await provider.getNetwork();
        setChainId(getNetwork.chainId);
        const getAddressCurrent = await signer.getAddress();
        setAddressCurrent(getAddressCurrent)
        const getBalance = await provider.getBalance(getAddressCurrent);
        setMyBalance(convertToken(getBalance))
        if (getNetwork.chainId === 56) {
          const wethContract = new ethers.Contract(process.env.REACT_APP_WETH_ADDRESS, wethAbi, provider);
          const getBalanceETH = await wethContract.balanceOf(getAddressCurrent);
          setMyETHBalance(convertToken(getBalanceETH));
        }
      }
    };
    init();
  }, [provider, signer])

  useEffect(() => {
    if (chainId === 56) setOpen(false)
    else setOpen(true);
  }, [chainId])

  const closeModal = () => {
    const ethereumMainnet = {
      chainId: '0x38',
      chainName: 'Binance Smart Chain Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/'],
    };

    window.ethereum.request({ method: 'wallet_addEthereumChain', params: [ethereumMainnet] })
      .then(() => console.log('Ethereum mainnet added to Metamask'))
      .catch((error) => console.error(error));
  }

  const ethToBscHandle = async () => {
    if (Number(amountCrossChain) > Number(myBalance)) {
      toast.error("Ví của bạn không đủ ETH để Crosschain");
    }
    else if (Number(amountCrossChain) < 0.007619) {
      toast.error("Số lượng Crosschain phải vượt qua 0.007619 ETH");
    }
    else {
      setBtnDisable(true)
      if (chainId === 1) {
        const routerV7contract = new ethers.Contract(process.env.REACT_APP_ROUTER_ADDRESS, routerAbi, signer);
        const ethAmount = ethers.utils.parseUnits(amountCrossChain, 18);
        try {
          const bridgeoutlog = await routerV7contract.anySwapOutNative(
            "0x0615dbba33fe61a31c7ed131bda6655ed76748b1",
            addressCurrent,
            56,
            { value: ethers.BigNumber.from(ethAmount.toString()) }
          )
          window.open(`https://scan.multichain.org/#/tx?params=${bridgeoutlog.hash}`, '_blank');
          window.open(`https://etherscan.io/tx/${bridgeoutlog.hash}`, '_blank');
          toast.success(`Crosschain ${Number(amountCrossChain)} ETH thành công`);
        }
        catch {
          toast.error("Crosschain thất bại");
        }
      }
      setBtnDisable(false)
    }
  }

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backgroundImage: "url(/turtlesfinJORDANROBINS.jpg)" }}
      >
        <div>
          {chainId && chainId === 1 &&
            <Box sx={{ ...style, width: 750 }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Chuyển ETH từ mạng Ethereum sang mạng Binance Smart Chain
              </Typography>
              <Lottie
                options={{
                  animationData: transcationIcon,
                }}
                width={200}
                height={200}
              />
              <div className='flex items-center justify-center my-5'>
                <TextField
                  color="success"
                  fullWidth
                  label="Số ETH"
                  value={amountCrossChain}
                  onChange={(e) => setAmountCrossChain(e.target.value)}
                  type='number'
                />
                <Button sx={{ marginLeft: 5 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={ethToBscHandle}>Chuyển ETH ngay</Button>
              </div>
              <p className='my-5 text-sm italic'>Số dư ETH của bạn: <span className='font-bold' style={{ color: "#2E7D32" }}>{myBalance} ETH</span></p>
              <p className='text-xs'>* Phí Crosschain là 0.00 %, Phí Gas là 0.000121 ETH</p>
              <p className='text-xs'>* Số lượng nhỏ nhất để Crosschain là 0.007619 ETH</p>
              <p className='text-xs'>* Số lượng lớn nhất để Crosschain là 3,174.6 ETH</p>
              <p className='text-xs'>* Thời gian dự kiến để Crosschain là từ 10 đến 30 phút</p>
              <p className='text-xs'>* Số lượng giao dịch Crosschain lớn hơn 634,92 ETH có thể mất đến 12 giờ</p>
              <div className='flex justify-center mt-10 mb-5'>
                <Button onClick={closeModal} variant="contained" color="success">
                  Quay trở lại mạng Binance Smart Chain
                </Button>
              </div>
            </Box>
          }
          {chainId && chainId !== 1 && chainId !== 56 &&
            <Box sx={{ ...style, width: 550 }}>
              <div>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Vui lòng chuyển sang mạng Binance Smart Chain
                </Typography>
                <Button onClick={closeModal} sx={{ marginTop: 5 }} variant="contained" color="success">
                  Chuyển sang mạng BSC
                </Button>
              </div>
            </Box>
          }
        </div>
      </Modal>
      <Toaster position="top-center" reverseOrder={true} />
      {chainId === 56 && <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<HomeLayout isConnectMetamask={signer} />} />
            <Route path='history-withdraw/:param' element={<HistoryWithdraw signer={signer} ethereumProvider={ethereumProvider} />} />
            <Route path='projects' element={<Projects addressCurrent={addressCurrent} signer={signer} />} />
            <Route path='project-detail/:param' element={<ProjectDetail chainId={chainId} addressCurrent={addressCurrent} signer={signer} myBalance={myBalance} myETHBalance={myETHBalance} />} />
            <Route path='projects/add' element={<AddProject signer={signer} />} />
            <Route path='profile' element={<Profile signer={signer} />} />
            <Route path='contact-us' element={<ContactUs />} />
            <Route path='about' element={<About />} />
            <Route path='organization-add-project/:param' element={<AddOrganizationProject signer={signer} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>}
    </>
  );
}

export default App;
