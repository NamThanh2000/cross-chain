import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";

const contractaddresses = {
  routerv7: {
    97: "0xaB9c7c8326B7e90339c23766EDAdF36C17c83ba2",
    80001: "0x8E680018D67C57889083c23786C225F730C54Fb5"
  },
  execcontract: {
    97: "0x9af276A66946d1B3B09760892AA08c9618381464",
    80001: "0xcaf870dad882b00f4b20d714bbf7fceada5e4195"
  },
  a1token: {
    97: "0x78F4CC9627739b5be8e12984D015756cef94b74B",
    80001: "0x8CD309e14575203535EF120b5b0Ab4DDeD0C2073"
  },
  a2token: {
    97: "0xc31970D88543FE0cDCfD3572047A5db5B9929C73",
    80001: "0xfd01A9409862fA090B1833868e72cE52112E2861"
  }
}
const chainidtonetwork = {
  '80001': 'polygonmumbai',
  '97': 'bnbtest'
}
var routerV7abi = require('./routerV7abi')

async function formatExplorerLink(txhash, chainid) {
  const chainidToExplorer = {
    '80001': 'https://mumbai.polygonscan.com/tx/',
    '97': 'https://testnet.bscscan.com/tx/'
  }
  const url = `${chainidToExplorer[chainid]}${txhash}`
  console.log(url)
  return url
}

async function pollAnyexec (chainid, sourecehash) {
  console.log(chainid)
  const networkname = {
    '80001': 'https://rpc.ankr.com/polygon_mumbai',
    '97': 'https://data-seed-prebsc-1-s1.binance.org:8545'
  }
  const rpc = networkname[chainid]
  const provider = new ethers.providers.StaticJsonRpcProvider(rpc)

  const routerv7address = contractaddresses['routerv7'][chainid]

  console.log("the routerV7 address is " + routerv7address)
  let executed = 0
  const routerV7contract = new ethers.Contract(routerv7address, routerV7abi, provider);
  routerV7contract.on("LogAnySwapInAndExec", (swapID, swapoutID, token, receiver, amount, fromChainID, success, result, event) => {
    if (swapID.includes(sourecehash)) {
      console.log('Your destination tx is executed')

      formatExplorerLink(event.transactionHash, chainid)
      executed = 1
    }
    return
  });
  function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis))
  }
  while (executed === 0) {
    console.log('polling for destination chain swap tx...')
    await sleep(2000)
  }
  return
}

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

    console.log("Chain ID:", chainid);

    let allchainids = Object.keys(chainidtonetwork)

    //select the opposite chain
    const otherchainids = allchainids.filter(item => item !== chainid.toString())
    console.log(otherchainids)

    //select polygon mumbai
    const tochainid = otherchainids[0]

    const routerv7address = contractaddresses['routerv7'][chainid]
    const a1TokenAddress = contractaddresses['a1token'][chainid]
    const a1TokenAddressDest = contractaddresses['a1token'][tochainid]

    const destinationExecContract = contractaddresses['execcontract'][tochainid]
    const destinationRouter=contractaddresses['routerv7'][tochainid]
    const a2TokenAddressDest = contractaddresses['a2token'][tochainid]
    console.log("the routerV7 address is " + routerv7address)

    const routerV7contract = new ethers.Contract(routerv7address, routerV7abi, signer);

    const uintFarAway = '16628028124120';
    const swapPathA1toA2onMumbai = [a1TokenAddressDest, a2TokenAddressDest]

    const onedecimal6 = 10000

    const accounts = await signer.getAddress();
    console.log(accounts)

    const dataPassedToDest = ethers.utils.defaultAbiCoder.encode(
      ["tuple(uint256,uint256,uint256,address[],address,uint256,bool)"],
      [[0, 0, 0, swapPathA1toA2onMumbai, accounts, uintFarAway, false]]
    )

    console.log(`dataPassedToDest is ${dataPassedToDest}`)

    const callargs = [
      a1TokenAddress,
      destinationExecContract,
      onedecimal6,
      tochainid,
      destinationExecContract,
      dataPassedToDest
    ]

    console.log(callargs)
    const bridgeoutlog = await routerV7contract.anySwapOutAndCall(...callargs)

    console.log('\n \n')
    console.log('source chain transaction sent')
    console.log(bridgeoutlog.hash)
    const sourcetx = bridgeoutlog.hash

    formatExplorerLink(sourcetx, chainid)
    await bridgeoutlog.wait(2)
    console.log('Waiting for destination chain tx to execute...')
    await pollAnyexec(tochainid, bridgeoutlog.hash)
  };

  return (
    <div>
      <button onClick={connectMetamask}>Kết nối MetaMask</button>
      <button onClick={getBalance}>Lấy số dư</button>
    </div>
  );
}

export default App;
