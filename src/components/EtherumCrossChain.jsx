import { Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import { useState } from "react";
import { ethToBsc, getMyBalance } from "../utils";
import { toast } from "react-hot-toast";
import { Button } from "@mui/material";

export default function EthereumCrossChain() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [amountCrossChain, setAmountCrossChain] = useState(null);
    const [myBalance, setMyBalance] = useState(null);
    const [btnDisable, setBtnDisable] = useState(false);

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
        const getMybalance = async () => {
            const balance = await getMyBalance(provider.getSigner(), provider)
            setMyBalance(balance)
        }
        getMybalance()
    }, [provider]);

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

    const changeBSC = () => {
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
        <div>
            <p className='font-bold'>Transfer ETH from the Ethereum Network to the BSC Network</p>
            <p className='text-xs'>* Crosschain Fee is 0.00 %, Gas Fee is 0.000121 ETH</p>
            <p className='text-xs'>* Minimum Crosschain Amount is 0.007619 ETH</p>
            <p className='text-xs'>* Maximum Crosschain Amount is 3,174.6 ETH</p>
            <p className='text-xs'>* Estimated Time of Crosschain Arrival is 10-30 min</p>
            <p className='text-xs'>* Crosschain amount larger than 634.92 ETH could take up to 12 hours</p>
            <input
                className='mt-2 p-4'
                value={amountCrossChain}
                onChange={(e) => setAmountCrossChain(e.target.value)}
                placeholder='Amount ETH Cross Chain'
                type='number'
            />
            {myBalance && <p className='mt-2 text-sm italic'>Balance: {myBalance[0]} ETH</p>}
            <div className="flex">
                <Button
                    variant="contained"
                    sx={{ marginTop: 5 }}
                    disabled={btnDisable}
                    // style={{ opacity: `${btnDisable ? 0.7 : 1}` }}
                    color="success"
                    onClick={ethToBscHandle}
                >
                    Transfer
                </Button>
                <Button onClick={changeBSC} sx={{ marginTop: 5, marginLeft: 2 }} variant="contained" color="success">
                    Quay lại BSC
                </Button>
            </div>
        </div>
    )
}