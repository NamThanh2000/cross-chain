import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import { getBalances } from "../utils";
import Header from './Header';

function FormDonate() {
    const [provider, setProvider] = useState(null);
    const [listMyDonate, SetListMyDonate] = useState([]);
    const [yourDonations, SetyourDonations] = useState(0);
    const [chainId, setChainId] = useState(0);

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
        const init = async () => {
            const [testGetBalance, yourDonations] = await getBalances(provider.getSigner(), provider, 3)
            SetListMyDonate(testGetBalance.reverse())
            SetyourDonations(yourDonations)
        }

        const getChainId = async () => {
            const network = await provider.getNetwork();
            const chainid = network.chainId;
            setChainId(chainid)
        }
        getChainId()

        init()
    }, [provider]);

    useEffect(() => {
        if (chainId === 1) {
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
    }, [chainId])
    return (
        <div>
            <div className='font-bold pt-4 text-lg'>
                YOUR TOTAL DONATE: <span className='text-green-700 text-xl'>{yourDonations.toFixed(2)} USDT</span>
            </div>
            <div>
                <div className='pt-4 pb-1 flex justify-center border-gray-300'
                    style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                >
                    <p className='w-64 font-bold text-lg'>Amount</p>
                    <p className='w-80 font-bold text-lg'>Timestamp</p>
                </div>
                {listMyDonate && listMyDonate.map((item, index) => {
                    return <div
                        key={index}
                        className='p-3 flex justify-center border-gray-300'
                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                    >
                        <p className='w-64 font-medium text-green-700 text-lg'>{Number(item.amount).toFixed(2)} USDT</p>
                        <p className='w-80 font-medium text-green-700 text-lg'>{item.timeStamp}</p>
                    </div>
                })}
            </div>
        </div>

    );
}

export default FormDonate;  