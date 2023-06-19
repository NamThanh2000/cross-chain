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
                        <p className='w-64 text-green-700 text-lg text-center'>{convertToken(item.amount).toFixed(2)}</p>
                        <p className='w-80 text-green-700 text-lg text-center'>{parseUnixTimeStamp(item.timestamp)}</p>
                    </div>
                })}
            </div>
            <div className='mt-4 text-lg font-medium'>
                Tổng: <span className='text-green-700'>{convertToken(totalDonate).toFixed(2)} USDT</span>
            </div>
        </>
    );
}

export default MyDonate;  