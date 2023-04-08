import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";

const routerV7abi = require('./namabi')
const donationABI = require('./DonationContract')


function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

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
      const donateTx = await donationContract.totalDonations();
      console.log("Balance: ", donateTx.toString());
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
      const routerV7contract = new ethers.Contract(routerv7address, routerV7abi, signer);
      const bridgeoutlog = await routerV7contract.anySwapOutNative(
        "0x0615dbba33fe61a31c7ed131bda6655ed76748b1",
        "0x63Bb4B859ddbdAE95103F632bee5098c47aE2461",
        56,
        {value: ethers.BigNumber.from("10000000000000000")} // Tính bằng Wei
      )
  
      console.log('\n \n')
      console.log('source chain transaction sent')
      console.log(bridgeoutlog.hash)
    }
  };

  const donateEth = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
      const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

      const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
      const donateAmount = ethers.utils.parseUnits("0.01", 18); // Chuyển đổi 0.01 BNB thành đơn vị wei
      const donateTx = await donationContract.donateBNBS(
        { value: donateAmount }
      );
      await donateTx.wait();
      console.log("Donate thành công: ", donateTx.toString());
    }
  };

  const donateBsc = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài đặt MetaMask!");
      return;
    }

    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
      const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

      const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
      const donateAmount = ethers.utils.parseUnits("0.01", 18); // Chuyển đổi 0.01 ETH thành đơn vị wei
      const donateTx = await donationContract.donateWETHS(
        donateAmount
      );
      await donateTx.wait();
      console.log("Donate thành công: ", donateTx.toString());
    }
  };

  const cssBlock = {
    'display': 'flex',
    'margin': '20px',
  }

  return (
    <div>
      <button style={cssBlock} onClick={connectMetamask}>Kết nối MetaMask</button>
      <button style={cssBlock} onClick={ethToBsc}>
        Chuyển ETH từ Ethereum Network sang BSC Network (Gas fee minimum 0.000121 ETH, Minimum Crosschain Amount is 0.008 ETH)</button>
      <button style={cssBlock} onClick={donateEth}>Donate bằng ETH trên BSC network</button>
      <button style={cssBlock} onClick={donateBsc}>Donate bằng BNB trên BSC network</button>
      <button style={cssBlock} onClick={getBalance}>Lấy tổng số Donate</button>
    </div>
  );
}

export default App;
