

function HomeLayout() {
    return <div className="fixed w-full">
        <div className="px-8 pt-5 flex justify-between ">
            <div className="flex items-end">
                <img className="w-26 h-12 mr-10" src="/tnc-logo-primary.svg" alt="logo" />
                <div className="mr-6">WHAT WE DO</div>
                <div className="mr-6">ABOUT US</div>
                <div className="mr-6">GET INVOLVED</div>
                <div className="mr-6">MEMBERSGIP & GIVING</div>
            </div>
            <div className="flex items-end">
                <button className="px-8 py-3  bg-green-600">DONATE</button>
            </div>
        </div>
    </div>


}

export default HomeLayout;  