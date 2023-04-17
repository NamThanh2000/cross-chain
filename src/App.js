import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeLayout from "./components/HomeLayout";
import Donate from './components/Donate';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from "./styles/theme/theme";
const routerV7ABI = require('./routerV7abi')
const donationABI = require('./DonationContractABI')


function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [amountCrossChain, setAmountCrossChain] = useState('');
  const [amountDonateETH, setAmountDonateETH] = useState('');
  const [amountDonateBNB, setAmountDonateBNB] = useState('');
  const [amountWithdrawUSDT, setAmountWithdrawUSDT] = useState('');

  useEffect(() => {
    const init = async () => {
      const ethereumProvider = await detectEthereumProvider();

      if (!ethereumProvider) {
        console.error("Không tìm thấy MetaMask");
        return;
      }

      setProvider(new Web3Provider(ethereumProvider));

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
  }, [provider]);

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Lỗi kết nối với MetaMask:", error);
    }
  };

  const getBalance = async () => {
    if (!signer) {
      alert("Vui lòng kết nối với MetaMask!");
      return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"
    if (chainid === 56) {
      const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
      const donateBalance = await donationContract.getContractBalance();
      let value = ethers.utils.formatUnits(donateBalance.toString(), 18);
      console.log("Total Donations: ", Number(value), 'USDT');

      const addressCurrent = await signer.getAddress();
      const donateOf = await donationContract.donationOf(addressCurrent);
      value = ethers.utils.formatUnits(donateOf.toString(), 18);
      console.log("Your Donations: ", Number(value), 'USDT');

      const donationHistory = await donationContract.getDonationHistory(addressCurrent);

      for (let i in donationHistory) {
        const donation = donationHistory[i];
        const amount = ethers.utils.formatUnits(donation.amount, 18);
        const timestamp = new Date(donation.timestamp * 1000);

        console.log(`Donation ${i + 1}:`);
        console.log(`- Amount: ${amount} USDT`);
        console.log(`- Timestamp: ${timestamp.toLocaleString()}`);
        console.log('\n');
      }
    }
  };

  const ethToBsc = async () => {
    if (!signer) {
      alert("Vui lòng kết nối với MetaMask!");
      return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 1) {
      const routerv7address = "0xba8da9dcf11b50b03fd5284f164ef5cdef910705"
      const routerV7contract = new ethers.Contract(routerv7address, routerV7ABI, signer);
      const addressCurrent = await signer.getAddress();
      const ethAmount = ethers.utils.parseUnits(amountCrossChain, 18);
      const bridgeoutlog = await routerV7contract.anySwapOutNative(
        "0x0615dbba33fe61a31c7ed131bda6655ed76748b1",
        addressCurrent,
        56,
        { value: ethers.BigNumber.from(ethAmount.toString()) }
      )
      console.log('Source chain transaction sent: ', bridgeoutlog.hash)
      console.log('https://scan.multichain.org/#/tx?params=:', bridgeoutlog.hash)
      console.log('https://etherscan.io/tx/', bridgeoutlog.hash)
    }
  };

  const donateETH = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
      const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

      const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
      const donateAmount = ethers.utils.parseUnits(amountDonateETH, 18);
      const donateTx = await donationContract.donateWETHS(
        donateAmount
      );
      await donateTx.wait();
      console.log("Donate thành công: ", donateTx.toString());
    }
  };

  const donateBNB = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
      const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

      const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
      const donateAmount = ethers.utils.parseUnits(amountDonateBNB, 18);
      const donateTx = await donationContract.donateBNBS(
        { value: donateAmount }
      );
      await donateTx.wait();
      console.log("Donate thành công: ", donateTx.toString());
    }
  };

  const withdrawUSDT = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
      const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

      const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
      const amountWithdraw = ethers.utils.parseUnits(amountWithdrawUSDT, 18);
      const donateTx = await donationContract.withdraw(amountWithdraw);
      await donateTx.wait();
      console.log("Withdraw thành công: ", donateTx.toString());
    }
  };

  const cssBlock = {
    'display': 'flex',
    'margin': '20px',
  }

  return (
    <ThemeProvider theme={lightTheme}>

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<HomeLayout />} />
          <Route path='/donate' element={<Donate />} />

          {/* <Route path='*' element={<NotFound />} /> */}

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    // <div>
    //   <button style={cssBlock} onClick={connectMetamask}>Kết nối MetaMask</button>
    //   <input 
    //     value={amountCrossChain} 
    //     onChange={(e) => setAmountCrossChain(e.target.value)} 
    //     style={cssBlock} 
    //     placeholder='Amount cross chain' 
    //     type='number'
    //   />
    //   <button style={cssBlock} onClick={ethToBsc}>
    //     Chuyển ETH từ Ethereum Network sang BSC Network (Gas fee minimum 0.000121 ETH, Minimum Crosschain Amount is 0.008 ETH)</button>
    //   <input 
    //     value={amountDonateETH} 
    //     onChange={(e) => setAmountDonateETH(e.target.value)} 
    //     style={cssBlock} 
    //     placeholder='Amount Donate ETH' 
    //     type='number'
    //   />
    //   <button style={cssBlock} onClick={donateETH}>Donate bằng ETH trên BSC network</button>
    //   <input 
    //     value={amountDonateBNB} 
    //     onChange={(e) => setAmountDonateBNB(e.target.value)} 
    //     style={cssBlock} 
    //     placeholder='Amount Donate BNB' 
    //     type='number'
    //   />
    //   <button style={cssBlock} onClick={donateBNB}>Donate bằng BNB trên BSC network</button>
    //   <button style={cssBlock} onClick={getBalance}>Lấy tổng số Donate</button>
    //   <input 
    //     value={amountWithdrawUSDT} 
    //     onChange={(e) => setAmountWithdrawUSDT(e.target.value)} 
    //     style={cssBlock} 
    //     placeholder='Amount Withdraw USDT' 
    //     type='number'
    //   />
    //   <button style={cssBlock} onClick={withdrawUSDT}>Rút token</button>
    // </div>
  );
}

export default App;
