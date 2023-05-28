import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
import React, { useEffect, useState } from 'react';
import { convertBigNumber, getListProjectMyDonate, getTotalProjectMyDonate, parseUnixTimeStamp } from '../utils';


const Profile = () => {
    const [provider, setProvider] = useState(null);
    const [listProjectMyDonate, setListProjectMyDonate] = useState(0);
    const [totalProjectMyDonate, setTotalProjectMyDonate] = useState(0);

    useEffect(() => {
        const init = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                console.error("Không tìm thấy MetaMask");
                return;
            }
            const provider = new Web3Provider(ethereumProvider);
            setProvider(provider)
        };
        init();
    }, []);

    useEffect(() => {
        const init = async () => {
            if (!provider) return;
            const signer = provider.getSigner()
            const listProjectMyDonate = await getListProjectMyDonate(signer)
            setListProjectMyDonate(listProjectMyDonate)

            const totalProjectMyDonate = await getTotalProjectMyDonate(signer)
            setTotalProjectMyDonate(totalProjectMyDonate)
        }
        init()

    }, [provider]);
    return (
        <div>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 p-2 flex justify-between ">
                    <div className="flex items-end">
                        <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>Homepage</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/projects'>Projects</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/profile'>Profile</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/contact-us'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/about'>About Us</a>
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-40 pt-32'>
                <h1 className='font-bold text-4xl text-center'>Thông tin của bạn</h1>
                <div className='mt-4 mb-2'>
                    <div className='flex'>
                        <p className='font-bold'>Tài khoản: </p>
                        <p className='ml-2'>0x63Bb4B859ddbdAE95103F632bee5098c47aE2461</p>
                    </div>
                    <div className='flex'>
                        <p className='font-bold'>Tổng số token bạn đã ủng hộ:</p>
                        <p className='ml-2'>{convertBigNumber(totalProjectMyDonate).toFixed(4)} <span className='font-bold'>USD</span></p>
                    </div>
                </div>
                <div className='mt-12'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-2xl'>Danh sách các dự án bạn đã ủng hộ</h1>
                    </div>
                    {listProjectMyDonate && listProjectMyDonate?.map((item) => {
                        return <a key={convertBigNumber(item.projectId)} href={`project-detail/${convertBigNumber(item.projectId)}`}>
                            <div className='flex m-4 p-4'>
                                <img className='w-40' src={item.imageUrl} alt="" />
                                <div className='ml-4'>
                                    <h2 className='font-bold text-lg'>{item.title}</h2>
                                    <div>
                                        <div>Mục tiêu: {convertBigNumber(item.amount)} <span className='font-bold'>USD</span></div>
                                        <div className='flex'>
                                            <p>Tiến độ:</p>
                                            <p className='ml-2'>
                                                {(convertBigNumber(item && item.totalDonations) / convertBigNumber(item && item.amount)) * 100 > 100 ?
                                                    100 : (item.totalDonations / convertBigNumber(item.amount)) * 100
                                                }
                                                %
                                            </p>
                                        </div>
                                        <div>Thời điểm ngừng kêu gọi: {parseUnixTimeStamp(item.deadline)}</div>
                                    </div>
                                </div>
                            </div>
                        </a>

                    })}
                </div>
            </div>
        </div>
    );
};

export default Profile;