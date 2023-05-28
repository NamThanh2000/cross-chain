import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import Donate from './components/Donate';
import HomeLayout from "./components/HomeLayout";
import MyDonate from './components/MyDonate';
import Withdraw from './components/Withdraw';
import { lightTheme } from "./styles/theme/theme";
import Projects from "./components/Project";
import ProjectDetail from "./components/ProjectDetail";
import About from "./components/About";
import AddProject from "./components/AddProject";
import ContactUs from "./components/ContactUs";
import AddOrganization from "./components/AddOrganization";
import Profile from "./components/Profile";


function App() {

  useEffect(() => {
    const init = async () => {
      const ethereumProvider = await detectEthereumProvider();

      if (!ethereumProvider) {
        console.error("Không tìm thấy MetaMask");
        return;
      }

      ethereumProvider.on("chainChanged", () => {
        window.location.reload();
      });

      ethereumProvider.on("accountsChanged", () => {
        window.location.reload();
      });
    };

    init();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={true}/>
      <ThemeProvider theme={lightTheme}>

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomeLayout />} />
            <Route path='/donate' element={<Donate />} />
            <Route path='/your-donate' element={<MyDonate />} />
            <Route path='/withdraw' element={<Withdraw />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/project-detail/:param' element={<ProjectDetail />} />
            <Route path='/projects/add' element={<AddProject />} />
            <Route path='profile' element={<Profile />} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='/about' element={<About />} />
            <Route path='/organization-add' element={<AddOrganization />} />

            {/* <Route path='*' element={<NotFound />} /> */}

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
