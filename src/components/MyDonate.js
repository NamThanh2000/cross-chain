import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { convertToken, parseUnixTimeStamp } from "../utils";

const donationAbi = require('../DonationAbi')

function MyDonate({ projectId, signer, addressCurrent, isOrg }) {
    const [totalDonate, setTotalDonate] = useState(0);
    const [listMyDonate, setListMyDonate] = useState([]);
    
    useEffect(() => {
        const init = async () => {
            if(signer) {
                const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
                let myDonate
                if (isOrg || addressCurrent === process.env.REACT_APP_OWNING_ADDRESS) {
                    myDonate = await donationContract.getEntireDonationHistory(projectId)
                } else {
                    myDonate = await donationContract.getDonationHistory(projectId)
                }
                const myTotalDonate = await donationContract.getMyDonationForProject(projectId)
                setListMyDonate(myDonate)
                setTotalDonate(myTotalDonate)
            }
        }
        init();
    }, [signer]);

    return (
        <>
            <div className='mt-5 text-lg font-medium'>
                Tổng: <span className='text-green-700'>{convertToken(totalDonate).toFixed(2)} USDT</span>
            </div>
            <div>
                <div className='mt-10 pb-1 flex justify-center border-gray-300'
                    style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                >
                    <p className='w-96 font-medium text-lg text-center'>Địa chỉ ví quyên góp</p>
                    <p className='w-28 font-medium text-lg text-center'>Số USDT</p>
                    <p className='w-44 font-medium text-lg text-center'>Thời điểm</p>
                    <p className='flex-1 font-medium text-lg text-center'>Nội dung</p>
                </div>
                {listMyDonate && listMyDonate.length > 0 ? listMyDonate.map((item, index) => {
                    return <div
                        key={index}
                        className='py-3 flex justify-center border-gray-300'
                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                    >
                        <p className='w-96 text-green-700 font-medium text-sx text-center flex items-center justify-center'>{item.donorWallet}</p>
                        <p className='w-28 text-green-700 font-medium text-sx text-center flex items-center justify-center'>{convertToken(item.amount).toFixed(2)}</p>
                        <p className='w-44 text-green-700 font-medium text-sx text-center flex items-center justify-center'>{parseUnixTimeStamp(item.timestamp)}</p>
                        <p className='flex-1 text-green-700 font-medium text-sx flex items-center justify-start px-5'>{item.content}</p>
                    </div>
                }): <div className="mt-10 text-center">Chưa có thông tin</div>}
            </div>
        </>
    );
}

export default MyDonate;  