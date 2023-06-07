import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import { convertBigNumber, getListHistoryMyDonateProject, getTotalMyDonateProject, parseUnixTimeStamp } from "../utils";

function FormDonate({ projectId }) {
    const [provider, setProvider] = useState(null);
    const [totalDonate, setTotalDonate] = useState(0);
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
            const signer = provider.getSigner()
            const getChainId = async () => {
                const network = await provider.getNetwork();
                const chainid = network.chainId;
                setChainId(chainid)
            }
            getChainId()
            const result = await getListHistoryMyDonateProject(signer, projectId)
            setListMyDonate(result)
            const totalMyDonate = await getTotalMyDonateProject(signer, projectId)
            setTotalDonate(totalMyDonate)
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
            <div className='font-medium mt-6 text-lg'>
                DANH SÁCH NHỮNG LẦN QUYÊN GÓP CỦA BẢN THÂN CHO DỰ ÁN NÀY:
            </div>
            <div>
                <div className='pt-10 pb-1 flex justify-center border-gray-300'
                    style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                >
                    <p className='w-64 font-medium text-lg text-center'>Số USDT</p>
                    <p className='w-80 font-medium text-lg text-center'>Thời điểm</p>
                </div>
                {listMyDonate && listMyDonate.map((item, index) => {
                    return <div
                        key={index}
                        className='p-3 flex justify-center border-gray-300'
                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                    >
                        <p className='w-64 text-green-700 text-lg text-center'>{convertBigNumber(item.amount).toFixed(4)}</p>
                        <p className='w-80 text-green-700 text-lg text-center'>{parseUnixTimeStamp(item.timestamp)}</p>
                    </div>
                })}
            </div>
            <div className='mt-4 text-lg font-medium'>
                Tổng: <span className='text-green-700'>{convertBigNumber(totalDonate).toFixed(4)} USDT</span>
            </div>
        </div>
    );
}

export default FormDonate;  