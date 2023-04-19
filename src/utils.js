import { ethers } from 'ethers';

const routerV7ABI = require('./routerV7abi')
const donationABI = require('./DonationContractABI')

export const connectMetamask = async () => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
        console.error("Lỗi kết nối với MetaMask:", error);
    }
};

export const ethToBsc = async (signer, provider, amountCrossChain) => {
    if (!signer) {
        alert("Vui lòng kết nối với MetaMask!");
        return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 1) {
        const routerv7address = "0xba8da9dcf11b50b03fd5284f164ef5cdef910705"
        const routerV7contract = new ethers.Contract(routerv7address, routerV7ABI, signer);
        const addressCurrent = await signer.getAddress();
        const ethAmount = ethers.utils.parseUnits(amountCrossChain, 18);
        const bridgeoutlog = await routerV7contract.anySwapOutNative(
            "0x0615dbba33fe61a31c7ed131bda6655ed76748b1",
            addressCurrent,
            56,
            { value: ethers.BigNumber.from(ethAmount.toString()) }
        )
        console.log('Source chain transaction sent: ', bridgeoutlog.hash)
        console.log('https://scan.multichain.org/#/tx?params=:', bridgeoutlog.hash)
        console.log('https://etherscan.io/tx/', bridgeoutlog.hash)
    }
};

export const getBalance = async (signer, provider, action) => {
    if (!signer) {
        alert("Vui lòng kết nối với MetaMask!");
        return;
    }
    
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"
    if (chainid === 56) {
        const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
        const donateBalance = await donationContract.getContractBalance();
        let totalDonations = ethers.utils.formatUnits(donateBalance.toString(), 18);
        console.log("Total Donations: ", Number(totalDonations), 'USDT');

        const addressCurrent = await signer.getAddress();
        const donateOf = await donationContract.donationOf(addressCurrent);
        let yourDonations = ethers.utils.formatUnits(donateOf.toString(), 18);
        console.log("Your Donations: ", Number(yourDonations), 'USDT');

        const donationHistory = await donationContract.getDonationHistory(addressCurrent);

        if (action === 1) {
            // Total Donations
            return Number(totalDonations)
        }
        let data = []
        for (let i in donationHistory) {
            const donation = donationHistory[i];
            const amount = ethers.utils.formatUnits(donation.amount, 18);
            const timestamp = new Date(donation.timestamp * 1000);
            data.push({
                'amount': amount,
                'timeStamp': timestamp.toLocaleString()
            })
            console.log(`Donation ${i + 1}:`);
            console.log(`- Amount: ${amount} USDT`);
            console.log(`- Timestamp: ${timestamp.toLocaleString()}`);
            console.log('\n');
        }
        return [data, Number(yourDonations)]
    }
};


export const donateETH = async (signer, provider, amountDonateETH) => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
        const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

        const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
        const donateAmount = ethers.utils.parseUnits(amountDonateETH, 18);
        const donateTx = await donationContract.donateWETHS(
            donateAmount
        );
        await donateTx.wait();
        console.log("Donate thành công: ", donateTx.toString());
    }
};

export const donateBNB = async (signer, provider, amountDonateBNB) => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
        const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

        const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
        const donateAmount = ethers.utils.parseUnits(amountDonateBNB, 18);
        const donateTx = await donationContract.donateBNBS(
            { value: donateAmount }
        );
        await donateTx.wait();
        console.log("Donate thành công: ", donateTx.toString());
    }
};

export const withdrawUSDT = async (signer, provider, amountWithdrawUSDT) => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }
    const network = await provider.getNetwork();
    const chainid = network.chainId;
    if (chainid === 56) {
        const donationAddress = "0x3232cB8474694360A5c1A7eEC66AB0b48a6d2A8D"

        const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
        const amountWithdraw = ethers.utils.parseUnits(amountWithdrawUSDT, 18);
        const donateTx = await donationContract.withdraw(amountWithdraw);
        await donateTx.wait();
        console.log("Withdraw thành công: ", donateTx.toString());
    }
};