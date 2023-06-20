import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import TabPanel from '@mui/lab/TabPanel';
import { Button, CircularProgress, TextField } from '@mui/material';
import { ethers } from 'ethers';
import React, { useState } from "react";
import toast from 'react-hot-toast';
import 'react-spinner-animated/dist/index.css';
import './FormDonateStyles.css';
import MyDonate from './MyDonate';
import Withdraw from './Withdraw';

const wethAbi = require('../IERC20Abi')
const donationAbi = require('../DonationAbi')

function FormDonate({ checkTab, projectId, addressCurrent, project, isOrg, myBalance, myETHBalance, signer, setValue }) {
    const [amountDonateETH, setAmountDonateETH] = useState("");
    const [amountDonateBNB, setAmountDonateBNB] = useState("");
    const [contentDonateBNB, setContentDonateBNB] = useState("");
    const [contentDonateETH, setContentDonateETH] = useState("");
    const [btnDisable, setBtnDisable] = useState(false);

    if (checkTab === "0") {
        const changeToETH = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                return;
            }
            const provider = new Web3Provider(ethereumProvider)
            try {
                await provider.send('wallet_switchEthereumChain', [{ chainId: '0x1' }]);
            } catch (error) {
                if (error.code === 4001) setValue("1")
            }
        }
        changeToETH();
    }

    const donateBNBHandle = async () => {
        if (amountDonateBNB) {
            if (amountDonateBNB < myBalance) {
                setBtnDisable(true)
                const donateAmount = ethers.utils.parseUnits(amountDonateBNB, 18);
                const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
                try {
                    const donateTx = await donationContract.donateBNB(
                        projectId,
                        contentDonateBNB,
                        { value: donateAmount },
                    );
                    await donateTx.wait();
                    toast.success("Quyên góp bằng BNB thành công");
                    window.open(`https://bscscan.com/tx/${donateTx.hash}`, '_blank');
                } catch {
                    toast.error("Quyên góp bằng BNB thất bại");
                }
                setBtnDisable(false)
            } else toast.error("Ví của bạn không đủ BNB để quyên góp");
        } else toast.error("Vui lòng nhập số BNB để quyên góp");
    }

    const donateETHHandle = async () => {
        if (amountDonateETH) {
            if (amountDonateETH < myETHBalance) {
                setBtnDisable(true)
                const donateAmount = ethers.utils.parseUnits(amountDonateETH, 18);
                const wethToken = new ethers.Contract(process.env.REACT_APP_WETH_ADDRESS, wethAbi, signer);
                const allowance = await wethToken.allowance(addressCurrent, process.env.REACT_APP_DONATION_ADDRESS);
                if (allowance.gte(donateAmount)) {
                    try {
                        const donationContract = new ethers.Contract(process.env.REACT_APP_DONATION_ADDRESS, donationAbi, signer);
                        const donateTx = await donationContract.donateWETH(
                            projectId,
                            contentDonateETH,
                            donateAmount
                        );
                        await donateTx.wait();
                        toast.success("Quyên góp bằng ETH thành công");
                        window.open(`https://bscscan.com/tx/${donateTx.hash}`, '_blank');
                    } catch {
                        toast.error("Quyên góp bằng ETH thất bại");
                    }
                } else {
                    try {
                        const donateTx = await wethToken.approve(process.env.REACT_APP_DONATION_ADDRESS, donateAmount);
                        await donateTx.wait();
                        toast.success("Chấp thuận token thành công");
                    } catch {
                        toast.error("Chấp thuận token thất bại");
                    }
                }
                setBtnDisable(false)
            } else toast.error("Ví của bạn không đủ ETH để quyên góp");
        } else toast.error("Vui lòng nhập số ETH để quyên góp");
    }
    return (
        <>
            <TabPanel value="0" className='p-6'>
                <div className='flex justify-center mt-20'>
                    <CircularProgress color="success" size={50} sx={{ margin: '0 auto' }} />
                </div>
            </TabPanel>
            <TabPanel value="1">
                <div className='p-8 border-gray-600'
                    style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                >
                    <p className='font-bold'>Quyên góp bằng BNB</p>
                    <TextField
                        style={{ marginTop: 20 }}
                        color="success"
                        fullWidth
                        label="Số BNB"
                        value={amountDonateBNB}
                        onChange={(e) => setAmountDonateBNB(e.target.value)}
                        type='number'
                    />
                    <TextField
                        style={{ marginTop: 20 }}
                        color="success"
                        multiline
                        fullWidth
                        onChange={(e) => setContentDonateBNB(e.target.value)}
                        label="Lời nhắn"
                    />
                    {myBalance && <p className='mt-2 text-sm italic'>Số dư BNB của bạn: <span className='font-bold' style={{ color: "#2E7D32" }}>{myBalance} BNB</span></p>}
                    <Button style={{ marginTop: 10 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={donateBNBHandle}>Quyên góp ngay bằng BNB</Button>
                </div>
                <div className='p-8'>
                    <p className='font-bold'>Quyên góp bằng ETH</p>
                    <TextField
                        style={{ marginTop: 20 }}
                        color="success"
                        fullWidth
                        label="Số ETH"
                        value={amountDonateETH}
                        onChange={(e) => setAmountDonateETH(e.target.value)}
                        placeholder='Số ETH'
                        type='number'
                    />
                    <TextField
                        style={{ marginTop: 20 }}
                        color="success"
                        multiline
                        onChange={(e) => setContentDonateETH(e.target.value)}
                        fullWidth
                        label="Lời nhắn"
                    />
                    {myBalance && <p className='mt-2 text-sm italic'>Số dư ETH của bạn: <span className='font-bold' style={{ color: "#2E7D32" }}>{myETHBalance} ETH</span></p>}
                    <Button style={{ marginTop: 10 }} variant="contained" disabled={btnDisable} color="success" size="large" onClick={donateETHHandle}>Quyên góp ngay bằng ETH</Button>
                </div>
            </TabPanel>
            <TabPanel value="2">
                <MyDonate projectId={projectId} signer={signer} addressCurrent={addressCurrent} isOrg={isOrg} />
            </TabPanel>
            <TabPanel value="3">
                <Withdraw
                    projectId={projectId}
                    signer={signer}
                    addressCurrent={addressCurrent}
                    totalWithdrawn={project["totalWithdrawn"]}
                    totalDonations={project["totalDonations"]}
                />
            </TabPanel>
        </>
    );
}

export default FormDonate;  