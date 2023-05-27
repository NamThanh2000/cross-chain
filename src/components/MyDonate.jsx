import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import { convertBigNumber, getBalances, getListHistoryMyDonateProject, parseUnixTimeStamp } from "../utils";
import Header from './Header';

function FormDonate({ projectId }) {
    const [provider, setProvider] = useState(null);
    const [listMyDonate, setListMyDonate] = useState([]);
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
            const getChainId = async () => {
                const network = await provider.getNetwork();
                const chainid = network.chainId;
                setChainId(chainid)
            }
            getChainId()
            const result = await getListHistoryMyDonateProject(provider.getSigner(), projectId)
            setListMyDonate(result)
        }


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
            {/* <div className='font-bold pt-4 text-lg'>
                            YOUR TOTAL DONATE: <span className='text-green-700 text-xl'>{convertBigNumber(item.amount)} USDT</span>
                        </div> */}
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
                        <p className='w-64 font-medium text-green-700 text-lg'>{convertBigNumber(item.amount).toFixed(4)} USD</p>
                        <p className='w-80 font-medium text-green-700 text-lg'>{parseUnixTimeStamp(item.timestamp)}</p>
                    </div>
                })}
            </div>
        </div>
    );
}

export default FormDonate;  