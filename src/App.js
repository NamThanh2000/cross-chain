import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
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
  const [open, setOpen] = React.useState(false);

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

  return (
    <div className="hehe">
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vui lòng chuyển sang mạng Binance Smart Chain
          </Typography>
          <Button onClick={closeModal} sx={{ marginTop: 5 }} variant="contained" color="success">
            Chuyển sang mạng BSC
          </Button>
        </Box>
      </Modal>
      <Toaster position="top-center" reverseOrder={true}/>
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
