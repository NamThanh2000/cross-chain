import React from 'react';
import './Organization.css';

const About = () => {
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
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/contact-us'>Contact Us</a>
                        <a className='mx-2 px-2 py-3 text-lg font-bold' href='/about'>About Us</a>
                        {/* <a href="/donate">
                            <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
                        </a> */}
                    </div>
                </div>
            </div>
            <div className='relative pt-22'>
                <div style={{ backgroundImage: `url(${'/background_home.png'})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '650px' }}
                    className="relative w-full h-650 flex items-center after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r after:from-black after:bg-opacity-10 after:to-transparent after:z-0">
                    <div className="absolute z-20 w-full flex flex-col items-center">
                        <h1 className=" text-white font-bold text-5xl">Về Chúng Tôi</h1>
                        {/* <p className="mt-2 text-white font-bold text1xl">Help protect the air you breathe, water you drink and places you call home.</p> */}
                    </div>
                </div>
                <div className="organization">
                    <h2 className="organization-heading">Our Organization</h2>
                    <p className="organization-description">Welcome to our organization! We are dedicated to making a positive impact on the environment and promoting sustainability.</p>
                    <p className="organization-description">Our team consists of passionate individuals who are committed to raising awareness, driving change, and implementing eco-friendly initiatives.</p>
                    <p className="organization-description">Through our collaborative efforts, we aim to create a greener and healthier planet for future generations.</p>
                </div>
            </div>

        </>
    );
};

export default About;