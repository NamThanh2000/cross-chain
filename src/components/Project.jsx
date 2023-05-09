import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask } from '../utils';


function HomeLayout() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);

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

    async function checkConnectMetamask() {
        if (typeof window.ethereum === 'undefined') {
            setIsConnectMetamask(true);
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                setIsConnectMetamask(true);
                return;
            }
        } catch (error) {
            setIsConnectMetamask(true);
            return;
        }
    }

    useEffect(() => {
        checkConnectMetamask();
        if (!provider) return;
    }, [provider]);

    return (
        <>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 p-2 flex justify-between ">
                    <div className="flex items-end">
                        <img className="w-26 h-12 mr-10 text-gray-700" src="/tnc-logo-primary-registered-dark-text.svg" alt="logo" />
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>Homepage</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/projects'>Projects</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>News & Events</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>About Us</a>
                        <a href="/donate">
                            <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
                        </a>
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                <div>
                    <img src="" alt="" />
                    <div>
                        <h2>Dự án về các hột giá đình nghèo</h2>
                        <p>Báo cáo thẩm tra của Uỷ ban Kinh tế cũng cho thấy, tỷ lệ khả năng thanh toán bằng tiền mặt bình quân đạt 0,09 lần (cùng kỳ 2022 là 0,19 lần). Tỷ lệ khả năng thanh toán lãi vay trong ba tháng đầu năm đạt 5,7 lần, giảm 0,8 lần so với cùng kỳ 2021. Nguyên nhân chủ yếu do mặt bằng lãi suất cho vay tăng nhanh và lợi nhuận doanh nghiệp sụt giảm từ đầu năm.</p>
                        <div>
                            <div>Mục tiêu: 10000 USD</div>
                            <div>tiến độ: 60%</div>
                            <div>Thời điểm ngừng kêu gọi: 19/07/2024</div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default HomeLayout;  