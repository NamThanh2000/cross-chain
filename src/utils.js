import { ethers } from 'ethers';

const routerV7ABI = require('./routerV7abi')
const donationABI = require('./DonationContractABI')
const wethABI = require('./IERC20Abi')

export const connectMetamask = async () => {
    if (typeof window.ethereum === 'undefined') {
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
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
    if (amountCrossChain && Number(amountCrossChain) > 0) {
        const network = await provider.getNetwork();
        const chainid = network.chainId;
        if (chainid === 1) {
            const routerv7address = "0xba8da9dcf11b50b03fd5284f164ef5cdef910705"
            const routerV7contract = new ethers.Contract(routerv7address, routerV7ABI, signer);
            const addressCurrent = await signer.getAddress();
            const ethAmount = ethers.utils.parseUnits(amountCrossChain, 18);
            try {
                const bridgeoutlog = await routerV7contract.anySwapOutNative(
                    "0x0615dbba33fe61a31c7ed131bda6655ed76748b1",
                    addressCurrent,
                    56,
                    { value: ethers.BigNumber.from(ethAmount.toString()) }
                )
                console.log(`Source chain transaction sent: ${bridgeoutlog.hash}`)
                console.log(`https://scan.multichain.org/#/tx?params=:${bridgeoutlog.hash}`)
                console.log(`https://etherscan.io/tx/${bridgeoutlog.hash}`)
                window.open(`https://scan.multichain.org/#/tx?params=:${bridgeoutlog.hash}`, '_blank');
                window.open(`https://etherscan.io/tx/${bridgeoutlog.hash}`, '_blank');
                return true
            }
            catch {
                return false
            }
        }
    }
};

export const getBalances = async (signer, provider, action) => {
    if (!signer) {
        alert("Vui lòng kết nối với MetaMask!");
        return;
    }

    const network = await provider.getNetwork();
    const chainid = network.chainId;

    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    if (chainid === 56) {
        const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
        const donateBalance = await donationContract.getContractBalance();
        let totalDonations = ethers.utils.formatUnits(donateBalance.toString(), 18);
        console.log("Total Donations: ", Number(totalDonations), 'USDT');

        const addressCurrent = await signer.getAddress();
        // const donateOf = await donationContract.donationOf(addressCurrent);
        // let yourDonations = ethers.utils.formatUnits(donateOf.toString(), 18);
        // console.log("Your Donations: ", Number(yourDonations), 'USDT');

        const donationHistory = await donationContract.getDonationHistory(addressCurrent);

        if (action === 1) {
            // Total Donations
            return Number(totalDonations)
        }
        else if (action === 2) {
            const total = await donationContract.totalDonations();
            return Number(ethers.utils.formatUnits(total.toString(), 18));
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
        return [data]
    }
};


export const donateETH = async (signer, provider, amountDonateETH, projectId, content) => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }

    if (amountDonateETH && Number(amountDonateETH) > 0) {
        const network = await provider.getNetwork();
        const chainid = network.chainId;
        if (chainid === 56) {
            const donateAmount = ethers.utils.parseUnits(amountDonateETH, 18);
            const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

            const wethAddress = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
            const wethToken = new ethers.Contract(wethAddress, wethABI, signer);
            const addressCurrent = await signer.getAddress();
            const allowance = await wethToken.allowance(addressCurrent, donationAddress);

            if (allowance.gte(donateAmount)) {
                const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
                try {
                    const donateTx = await donationContract.donateWETH(
                        projectId,
                        content,
                        donateAmount
                    );
                    await donateTx.wait();
                    console.log("Donate thành công: ", donateTx.toString());
                    window.open(`https://bscscan.com/tx/${donateTx.toString()}`, '_blank');
                    return true
                }
                catch {
                    return false
                }

            } else {
                const tx = await wethToken.approve(donationAddress, donateAmount);
                await tx.wait();
                console.log("WETH approved successfully!");
            }

        }
    }
};

export const donateBNB = async (signer, provider, amountDonateBNB, projectId, content) => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }
    if (amountDonateBNB && Number(amountDonateBNB) > 0) {
        const network = await provider.getNetwork();
        const chainid = network.chainId;

        if (chainid === 56) {
            const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

            const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
            const donateAmount = ethers.utils.parseUnits(amountDonateBNB, 18);
            try {
                const donateTx = await donationContract.donateBNB(
                    projectId,
                    content,
                    { value: donateAmount },
                );
                await donateTx.wait();
                console.log("Donate thành công: ", donateTx.toString());
                window.open(`https://bscscan.com/tx/${donateTx.toString()}`, '_blank');
                return true
            }
            catch {
                return false
            }

        }
    }
};

export const withdrawUSDT = async (signer, provider, amountWithdrawUSDT, projectId, content='') => {
    if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
    }
    if (amountWithdrawUSDT && Number(amountWithdrawUSDT) > 0) {
        const network = await provider.getNetwork();
        const chainid = network.chainId;
        if (chainid === 56) {
            const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

            const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
            const amountWithdraw = ethers.utils.parseUnits(amountWithdrawUSDT, 18);
            try {
                const donateTx = await donationContract.withdraw(projectId, amountWithdraw, content);
                await donateTx.wait();
                console.log("Withdraw thành công: ", donateTx.toString());
                return true
            } catch {
                return false
            }
        }
    }
};

export const getMyBalance = async (signer, provider) => {
    let balanceInBNB = null
    let balanceInWETH = null
    const addressCurrent = await signer.getAddress();

    const balanceBNB = await provider.getBalance(addressCurrent);
    balanceInBNB = ethers.utils.formatEther(balanceBNB);

    try {
        const wethContract = new ethers.Contract("0x2170Ed0880ac9A755fd29B2688956BD959F933F8", wethABI, provider);
        const balanceETH = await wethContract.balanceOf(addressCurrent);
        balanceInWETH = ethers.utils.formatEther(balanceETH);

    } catch (err) {
        console.log(err);
    }
    return [balanceInBNB, balanceInWETH]
}


export const getAllProject = async (signer) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const allProject = await donationContract.getProjectsList();
    return allProject
}


export const getListActiveProject = async (signer) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const listActiveProject = await donationContract.getActiveProjects();
    return listActiveProject
}


export const getProjectDetail = async (signer, projectIt) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const project = await donationContract.getProject(projectIt);
    return project
}


export const addProject = async (signer, data) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const amountUnit = ethers.utils.parseUnits(data.amount, 18);

    const addProject = await donationContract.addProject(data.title, data.objective, data.unixTimestamp, amountUnit, data.image_url)
    const result = addProject.wait()
    if (result) {
        return true
    }
    return false
}


export const addOrganization = async (signer, data) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);

    const addProject = await donationContract.addOrganization(data.name, data.description, data.imageUrl, data.wallet)
    const result = addProject.wait()
    if (result) {
        return true
    }
    return false
}


export const addWithdrawImage = async (signer, projectId, withdrawId, imageUrl) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);

    const addWithdrawImage = await donationContract.addWithdrawImage(projectId, withdrawId, imageUrl)
    const result = addWithdrawImage.wait()
    if (result) {
        return true
    }
    return false
}


export const convertBigNumber = (number) => {
    if (number){
        let result = ethers.utils.formatUnits(number?.toString(), 18);
        return Number(result)
    }
    return 0
}


export const convertProjectId = (number) => {
    if (number){
        let result = ethers.utils.formatUnits(number?.toString(), 0);
        return Number(result)
    }
    return 0
}


export const parseUnixTimeStamp = (timeStamp) => {
    const date = new Date(timeStamp * 1000);

    // Extract the different components of the date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Create a formatted string
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime
}


export const getAllHistoryProject = async (signer, projectId) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const allHistory = await donationContract.getEntireDonationHistory(projectId);
    return allHistory
}


export const getListHistoryMyDonateProject = async (signer, projectId) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"

    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const myDonate = await donationContract.getDonationHistory(projectId)
    return myDonate
}


export const getTotalMyDonateProject = async(signer, projectId) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const myTotalDonate = await donationContract.getMyDonationForProject(projectId)
    return myTotalDonate
    
}


export const getListWithdrawProject = async(signer, projectId) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const listWithdraw = await donationContract.getWithdrawalHistory(projectId)
    return listWithdraw
    
}


export const getListProjectMyDonate = async(signer) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const listProjectMyDonate = await donationContract.getDonatedProjects()
    return listProjectMyDonate
    
}


export const getTotalProjectMyDonate = async(signer) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const totalProjectMyDonate = await donationContract.getTotalDonation()
    return totalProjectMyDonate
}


export const getOrganizationsProject = async(signer) => {
    const donationAddress = "0xcC138083ba38dc7594142Af8E5A6925EdB23414B"
    const donationContract = new ethers.Contract(donationAddress, donationABI, signer);
    const organizationsProject = await donationContract.getOrganizationsForProject()
    return organizationsProject
}