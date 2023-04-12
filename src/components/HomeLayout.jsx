

function HomeLayout() {
  return (
    <>
      <div className="fixed z-10 w-full">
        <div className="px-8 pt-5 flex justify-between ">
          <div className="flex items-end">
            <img className="w-26 h-12 mr-10" src="/tnc-logo-primary.svg" alt="logo" />
            <div className="mr-6 text-white font-bold">WHAT WE DO</div>
            <div className="mr-6 text-white font-bold">GET INVOLVED</div>
            <div className="mr-6 text-white font-bold">MEMBERSGIP & GIVING</div>
            <div className="mr-6 text-white font-bold">ABOUT US</div>
          </div>
          <div className="flex items-end">
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
        <div className="absolute z-20 mx-60">
          <h1 className=" text-white font-bold text-5xl">Protect What Nature Gives You</h1>
          <p className="mt-2 text-white font-bold text1xl">Help protect the air you breathe, water you drink and places you call home.</p>
          <button className="mt-6 px-8 py-3 bg-white text-green-700 font-bold">GIVE NOW</button>
        </div>
      </div>
    </>

  );
}

export default HomeLayout;  