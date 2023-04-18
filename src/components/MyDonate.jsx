import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";

import { getBalance } from "../utils"

function FormDonate() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [amountCrossChain, setAmountCrossChain] = useState('');
    const [amountDonateETH, setAmountDonateETH] = useState('');
    const [amountDonateBNB, setAmountDonateBNB] = useState('');
    const [amountWithdrawUSDT, setAmountWithdrawUSDT] = useState('');

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
        setSigner(provider.getSigner());
        const init = async () => {
            const testGetBalance = await getBalance(provider.getSigner(), provider)
        }

        init()
    }, [provider]);

    return (
        <div>

        </div>
    );
}

export default FormDonate;  