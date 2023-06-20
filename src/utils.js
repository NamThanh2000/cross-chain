import { ethers } from 'ethers';

export const convertToken = (number) => {
    return Number(ethers.utils.formatUnits(number, 18));
}


export const convertId = (number) => {
    return Number(ethers.utils.formatUnits(number, 0));
}


export const parseUnixTimeStamp = (timeStamp) => {
    const date = new Date(timeStamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime
}
