import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask, getAllProject } from '../utils';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


function ContactUs() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);
    const [projects, setProjects] = useState(null);
    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

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
        const handleGetProjects = async () => {
            const allProject = await getAllProject(provider.getSigner())
            console.log(allProject)
        }
        handleGetProjects()
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
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/contact-us'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/about'>About Us</a>
                        {/* <a href="/donate">
                            <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
                        </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                <div className='my-20 lg:flex lg:items-center'>
                    <div className='w-1/2'>
                        <img className='mb-2 w-full' src="https://static.kinhtedothi.vn/w960/images/upload/2022/10/12/quang-nam-2.jpg" alt="quang-nam-2" />
                        <img className='w-full' src="http://tapchibaohiemxahoi.gov.vn/media/articles/images/tranght/032022/c3c42b63-ce15-42cb-8f2c-91c40902118d.png" alt="" />
                    </div>
                    <div className='lg:ml-20'>
                        {/* <p className='font-bold text-sm py-4'>OUR MISSION</p> */}
                        <h2 className='text-5xl font-bold'>Hãy chung tay góp sức vì cộng đồng</h2>
                        <p className='py-4'>
                            Hãy đồng hành cùng chúng tôi vì một tương lai tốt đẹp hơn
                        </p>
                        <p>
                            Những lời kêu gọi của bạn sẽ giúp ít rất nhiều cho cộng đồng và xã hội của đất nước ta càng ngày càng lớn mạnh.
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ContactUs;  