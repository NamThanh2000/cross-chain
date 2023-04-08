import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";

var SushiRouterAbi = require('./SushirouterAbi')

const SUSHI_ROUTER_ADDRESS = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

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
    const chainId = network.chainId;
  
    console.log("Chain ID:", chainId);

    const sushiRouter = new ethers.Contract(SUSHI_ROUTER_ADDRESS, SushiRouterAbi, signer);
    
    console.log(sushiRouter.interface)
    const matictoA1path = ["0x5b67676a984807a212b1c59ebfc9b3568a474f0a", "0x8CD309e14575203535EF120b5b0Ab4DDeD0C2073"]

    //Get 5 test tokens, its decimal 6
    const neededMatic = await sushiRouter.getAmountsIn('10000', matictoA1path)
    console.log(neededMatic)
    const accounts = await signer.getAddress();
    console.log(accounts)
    const swaptx = await sushiRouter.swapExactETHForTokens('0', matictoA1path, accounts, '166311560900000', { value: neededMatic[0] })
    console.log('swap tx transaction sent')
    console.log(swaptx.hash)
    await swaptx.wait()
    console.log(`https://mumbai.polygonscan.com/tx/${swaptx.hash}`)
  };

  return (
    <div>
      <button onClick={connectMetamask}>Kết nối MetaMask</button>
      <button onClick={getBalance}>Lấy số dư</button>
    </div>
  );
}

export default App;
