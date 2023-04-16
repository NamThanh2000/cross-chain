

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