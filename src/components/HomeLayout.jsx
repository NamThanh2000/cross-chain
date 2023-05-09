import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from 'react';
import { connectMetamask } from '../utils';


function HomeLayout() {
  const [provider, setProvider] = useState(null);
  const [isConnectMetamask, setIsConnectMetamask] = useState(false);

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
  }, [provider]);

  return (
    <>
      <div className="fixed z-30 w-full bg-white shadow-xl">
        <div className="px-8 p-2 flex justify-between ">
          <div className="flex items-end">
            <img className="w-26 h-12 mr-10 text-gray-700" src="/tnc-logo-primary-registered-dark-text.svg" alt="logo" />
            {/* <div className="mr-6 text-white font-bold">WHAT WE DO</div>
            <div className="mr-6 text-white font-bold">GET INVOLVED</div>
            <div className="mr-6 text-white font-bold">MEMBERSGIP & GIVING</div>
            <div className="mr-6 text-white font-bold">ABOUT US</div> */}
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
      <div style={{ backgroundImage: `url(${'/background_home.png'})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '650px' }}
        className="relative w-full h-650 flex items-center after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r after:from-black after:bg-opacity-10 after:to-transparent after:z-0">
        {/* <div
          className="after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r after:from-black after:bg-opacity-10 after:to-transparent
      "
        >
        </div> */}
        <div className="absolute z-20 lg:mx-60 mx-5">
          <h1 className=" text-white font-bold text-5xl">Protect What Nature Gives You</h1>
          <p className="mt-2 text-white font-bold text1xl">Help protect the air you breathe, water you drink and places you call home.</p>
          {isConnectMetamask && <button onClick={connectMetamask} className="mt-6 px-8 py-3 bg-white text-green-700 font-bold">Connect To MetaMask Wallet</button>}
        </div>
      </div>
      <div className='sm:container mx-auto px-10 mt-10'>
        <div
          className='lg:flex justify-center lg:py-20 border-gray-600'
          style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
        >
          <div
            className='py-6 px-4 lg:w-4/5'
          >
            <h2 className='text-3xl font-bold'>Stepping Up Progress in this Defining Decade</h2>
            <p className='mt-3'>Alongside communities, we're urgently clearing obstacles and finding solutions to the climate and biodiversity crises.</p>
          </div>
          <div className='grid lggrid-cols-2 px-4 '>
            <div
              className='lg:mx-6 py-6 border-gray-600'
              style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
            >
              <h3 className='text-2xl text-green-700 font-bold'>Who We Are</h3>
              <p className='mt-2'>We are dedicated staff, scientists and members advancing effective, lasting conservation in more than 70 countries and territories.</p>
            </div>
            <div
              className='lg:mx-6 py-6 border-gray-600'
              style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
            >
              <h3 className='text-2xl text-green-700 font-bold'>What We Do</h3>
              <p className='mt-2'>To make the highest possible impact on the climate and biodiversity crises between now and 2030, we're developing breakthrough ideas, amplifying local leaders and influencing policy.</p>
            </div>
            <div className='lg:mx-6 py-6'>
              <h3 className='text-2xl text-green-700 font-bold'>How To Help</h3>
              <p className='mt-2'>There are so many ways to make positive change for our planet. Volunteer with us. Learn how to reduce your carbon footprint. Donate to conservation work.</p>
            </div>
            <div className='lg:mx-6 py-6'>
              <h3 className='text-2xl text-green-700 font-bold'>Where We Work</h3>
              <p className='mt-2'>Dense rainforests, remote coral reefs and the hearts of major cities. Our strategies are as diverse as the habitats and geographies in which we work.</p>
            </div>
          </div>
        </div>
        <div className='my-20 lg:flex lg:items-center'>
          <img src="/WOPA160517.jpg" alt="WOPA160517" />
          <div className='lg:ml-20'>
            <p className='font-bold text-sm py-4'>OUR MISSION</p>
            <h2 className='text-5xl font-bold'>Conserving the lands and waters on which all life depends</h2>
            <p className='py-8'>Every acre we protect and every river mile we restore begins with you. Your support helps us take on the dual threats of climate change and biodiversity loss across 70+ countries and territories.</p>
            <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE NOW</button>
            </a>
          </div>
        </div>
        <div
          className='lg:flex justify-center my-20'
        >
          <div
            className='py-6 px-4'
            style={{ width: '80%' }}
          >
            <h2 className='text-3xl font-bold'>Our Goals for 2030</h2>
            <p className='mt-3'>We're racing to hit these targets to help the world reverse climate change and biodiversity loss. Together, we find the paths to make change possible.</p>
          </div>
          <div className='grid lg:grid-cols-3 px-4 '>
            <div
              className='lg:mx-6 py-6'
            >
              <div className='flex items-center'>
                <img className='w-14' src="/Icon_CO2.svg" alt="Icon_CO2" />
                <h3 className='text-5xl font-bold ml-2'>3B</h3>
              </div>
              <p className='mt-2'>Avoid or sequester 3 billion metric tons of carbon dioxide emissions annually—the same as taking 650 million cars off the road every year.</p>
            </div>
            <div
              className='lg:mx-6 py-6'
            >
              <div className='flex items-center'>
                <img className='w-14' src="/Icon_People.svg" alt="Icon_People" />
                <h3 className='text-5xl font-bold ml-2'>100M</h3>
              </div>
              <p className='mt-2'>Help 100 million people at severe risk of climate-related emergencies by safeguarding habitats that protect communities.</p>
            </div>
            <div
              className='lg:mx-6 py-6'
            >
              <div className='flex items-center'>
                <img className='w-14' src="/Icon_Land.svg" alt="Icon_Land" />
                <h3 className='text-5xl font-bold ml-2'>650M</h3>
              </div>
              <p className='mt-2'>Conserve 650 million hectares—a land area twice the size of India—of biodiverse habitats such as forests, grasslands and desert.</p>
            </div>
            <div
              className='lg:mx-6 py-6'
            >
              <div className='flex items-center'>
                <img className='w-14' src="/Icon_Ocean.svg" alt="Icon_Ocean" />
                <h3 className='text-5xl font-bold ml-2'>4B</h3>
              </div>
              <p className='mt-2'>Conserve 4 billion hectares of marine habitat—more than 10% of the world's oceans—through protected areas, sustainable fishing and more.</p>
            </div>
            <div
              className='lg:mx-6 py-6'
            >
              <div className='flex items-center'>
                <img className='w-14' src="/Icon_River.svg" alt="Icon_River" />
                <h3 className='text-5xl font-bold ml-2'>30M</h3>
              </div>
              <p className='mt-2'>Conserve 1 million kilometers of rivers—enough to stretch 25 times around the globe—plus 30 million hectares of lakes and wetlands.</p>
            </div>
            <div
              className='lg:mx-6 py-6'
            >
              <div className='flex items-center'>
                <img className='w-14' src="/Icon_Partnership.svg" alt="Icon_Partnership" />
                <h3 className='text-5xl font-bold ml-2'>45M</h3>
              </div>
              <p className='mt-2'>Support the leadership of 45 million people from Indigenous and local communities in stewarding their environment and securing rights.</p>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}

export default HomeLayout;  