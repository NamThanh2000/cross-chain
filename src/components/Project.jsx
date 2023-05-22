import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask, getAllProject } from '../utils';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


function Projects() {
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
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/'>About Us</a>
                        <a href="/donate">
                            <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
                        </a>
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                <div className='flex justify-end mb-6'>
                    <Button href='/projects/add' variant="outlined">Thêm mới dự án</Button>
                </div>
                <div className='flex justify-between'>
                    <h1 className='font-bold text-3xl'>Danh sách các dự án</h1>
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div className='flex m-4 p-4'>
                    <img className='w-40' src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/309613876_537052435087507_8459997665756261862_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=K4olyZ4GtSQAX_6Z7EQ&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfBGz-IMhBLAQAlep-tM82i6SS8rkCseAZoNzsMeHZ0u_Q&oe=646E67D9" alt="" />
                    <div className='ml-4'>
                        <h2 className='font-bold text-lg'>Dự án về các hột giá đình nghèo</h2>
                        <p>Báo cáo thẩm tra của Uỷ ban Kinh tế cũng cho thấy, tỷ lệ khả năng thanh toán bằng tiền mặt bình quân đạt 0,09 lần (cùng kỳ 2022 là 0,19 lần). Tỷ lệ khả năng thanh toán lãi vay trong ba tháng đầu năm đạt 5,7 lần, giảm 0,8 lần so với cùng kỳ 2021. Nguyên nhân chủ yếu do mặt bằng lãi suất cho vay tăng nhanh và lợi nhuận doanh nghiệp sụt giảm từ đầu năm.</p>
                        <div>
                            <div>Mục tiêu: 10000 USD</div>
                            <div>Tiến độ: 60%</div>
                            <div>Thời điểm ngừng kêu gọi: 19/07/2024</div>
                        </div>
                    </div>
                </div>
                <div className='flex m-4 p-4'>
                    <img className='w-40' src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/309613876_537052435087507_8459997665756261862_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=K4olyZ4GtSQAX_6Z7EQ&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfBGz-IMhBLAQAlep-tM82i6SS8rkCseAZoNzsMeHZ0u_Q&oe=646E67D9" alt="" />
                    <div className='ml-4'>
                        <h2 className='font-bold text-lg'>Dự án về các hột giá đình nghèo</h2>
                        <p>Báo cáo thẩm tra của Uỷ ban Kinh tế cũng cho thấy, tỷ lệ khả năng thanh toán bằng tiền mặt bình quân đạt 0,09 lần (cùng kỳ 2022 là 0,19 lần). Tỷ lệ khả năng thanh toán lãi vay trong ba tháng đầu năm đạt 5,7 lần, giảm 0,8 lần so với cùng kỳ 2021. Nguyên nhân chủ yếu do mặt bằng lãi suất cho vay tăng nhanh và lợi nhuận doanh nghiệp sụt giảm từ đầu năm.</p>
                        <div>
                            <div>Mục tiêu: 10000 USD</div>
                            <div>Tiến độ: 60%</div>
                            <div>Thời điểm ngừng kêu gọi: 19/07/2024</div>
                        </div>
                    </div>
                </div>
                <div className='flex m-4 p-4'>
                    <img className='w-40' src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/309613876_537052435087507_8459997665756261862_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=K4olyZ4GtSQAX_6Z7EQ&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfBGz-IMhBLAQAlep-tM82i6SS8rkCseAZoNzsMeHZ0u_Q&oe=646E67D9" alt="" />
                    <div className='ml-4'>
                        <h2 className='font-bold text-lg'>Dự án về các hột giá đình nghèo</h2>
                        <p>Báo cáo thẩm tra của Uỷ ban Kinh tế cũng cho thấy, tỷ lệ khả năng thanh toán bằng tiền mặt bình quân đạt 0,09 lần (cùng kỳ 2022 là 0,19 lần). Tỷ lệ khả năng thanh toán lãi vay trong ba tháng đầu năm đạt 5,7 lần, giảm 0,8 lần so với cùng kỳ 2021. Nguyên nhân chủ yếu do mặt bằng lãi suất cho vay tăng nhanh và lợi nhuận doanh nghiệp sụt giảm từ đầu năm.</p>
                        <div>
                            <div>Mục tiêu: 10000 USD</div>
                            <div>Tiến độ: 60%</div>
                            <div>Thời điểm ngừng kêu gọi: 19/07/2024</div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Projects;  