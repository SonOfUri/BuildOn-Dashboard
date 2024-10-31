import MktIcons from "./MktIcons";

const MktHeader = () => {
  return (
    <header className="bg-black sm:px-10 w-full border border-[#FF4D00] rounded-lg">
      <div className="flex flex-col lg:flex-row justify-between w-full items-start lg:items-center p-4 lg:p-0">
        {/* Title and Description */}
        <div className="w-full lg:w-2/3 text-start">
          <h3 className="text-2xl sm:text-3xl lg:text-[40px] font-bold">
            Lendbit Marketplace
          </h3>
          <p className="text-sm sm:text-base lg:text-[15px] mt-2">
            Explore a world of lending and borrowing possibilities—find the
            perfect match for your financial needs and let your assets work
            smarter for you.
          </p>
        </div>

        {/* Icons - Hidden on mobile */}
        <div className="relative mt-6 lg:mt-0 lg:ml-6 hidden lg:block">
          <MktIcons />
        </div>
      </div>
    </header>
  );
};

export default MktHeader;
