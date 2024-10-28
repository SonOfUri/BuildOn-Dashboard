// "use client";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { OrderCard } from "./OrderCard";
// import { cardGradient } from "@/constants/utils/cardGradient";

// export const OpenOrder = ({orderSample}:any) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollPosition, setScrollPosition] = useState(0);

//   const handleScroll = () => {
//     if (containerRef.current) {
//       const containerWidth = containerRef.current.offsetWidth;
//       const scrollLeft = containerRef.current.scrollLeft;
//       const cardWidth = 176;

//       const centerIndex = Math.round((scrollLeft + containerWidth / 2) / cardWidth) - 1;
//       setCurrentIndex(centerIndex);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (containerRef.current) {
//       setIsDragging(true);
//       setStartX(e.pageX - containerRef.current.offsetLeft);
//       setScrollPosition(containerRef.current.scrollLeft);
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !containerRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - containerRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     containerRef.current.scrollLeft = scrollPosition - walk;
//   };

//   const handleMouseUpOrLeave = () => {
//     setIsDragging(false);
//   };

//   return (
//     <div className="relative w-full py-4 open-orders">
//       <h3 className="text-lg font-normal mb-4 ml-4">Open Orders</h3>

//       {/* Left Arrow */}
//       <button
//         onClick={() => containerRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
//         className="absolute left-[-5%] top-[55%] transform -translate-y-1/2 z-20 p-2 rounded-full hidden sm:block"
//       >
//         <Image src="/Arrow-left.svg" alt="Scroll Left" width={40} height={40} />
//       </button>

//       <div
//         ref={containerRef}
//         className="h-80 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab"
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUpOrLeave}
//         onMouseLeave={handleMouseUpOrLeave}
//         onScroll={handleScroll}
//       >
//         <div className="flex gap-6 u-no-scroll-y">
//           {orderSample.map((order: any, index: number) => {
//             const randomGradient = cardGradient[Math.floor(Math.random() * cardGradient.length)] || "/gradients2.svg";
//             return(
//               <div
//                 key={order.id}
//                 className={`py-4 transition-all duration-500 z-10 flex-none ${index === currentIndex
//                   ? "scale-110 shadow-lg shadow-[#FF4D00]/50" // Center card is bigger with shadow
//                   : "scale-100"
//                   }`}
//               >
//                 <div className="w-32 h-52 sm:w-44 sm:h-72 m-auto ml-4">
//                   <OrderCard
//                     id={order.id}
//                     type={order.type}
//                     amount={order.amount}
//                     token={order.token}
//                     date={order.date}
//                     icon1={"/edit.svg"}
//                     icon2={"/delete.svg"}
//                     isSelected={currentIndex === index}
//                     cardGradient={randomGradient}
//                   />
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* Right Arrow */}
//       <button
//         onClick={() => containerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
//         className="absolute right-[-7%] top-[55%] transform -translate-y-1/2 z-20 p-2 rounded-full hidden sm:block"
//       >
//         <Image src="/Arrow-right.svg" alt="Scroll Right" width={40} height={40} />
//       </button>
//     </div>
//   );
// };

"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { OrderCard } from "./OrderCard";
import { cardGradient } from "@/constants/utils/cardGradient";
import { tokenImageMap } from "@/constants/utils/tokenImageMap";

export const OpenOrder = ({ orderSample }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scrollLeft = containerRef.current.scrollLeft;
      const cardWidth = 176;

      const centerIndex = Math.round((scrollLeft + containerWidth / 2) / cardWidth) - 1;
      setCurrentIndex(centerIndex);
    }
  };

  // Initial centering of the cards on load
  // useEffect(() => {
  //   if (containerRef.current && orderSample.length > 0) {
  //     const containerWidth = containerRef.current.offsetWidth;
  //     const cardWidth = 176;
  //     const initialScroll = (cardWidth * orderSample.length - containerWidth) / 2;
  //     containerRef.current.scrollLeft = initialScroll;
  //   }
  // }, [orderSample]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      containerRef.current.style.cursor = "grabbing"; // Change cursor when dragging starts
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed by multiplying
    containerRef.current.scrollLeft = scrollPosition - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab"; // Reset cursor after dragging ends
    }
  };

  // Add keyboard accessibility for scrolling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        containerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
      }
      if (event.key === "ArrowLeft") {
        containerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full py-4 open-orders filledInActive">
      {/* Header always visible */}
      <h3 className="text-lg font-normal mb-4 ml-4">Open Orders</h3>

      {/* Conditional rendering for empty orders */}
      {!orderSample || orderSample.length === 0 ? (
        <div className="flex justify-center items-center h-[200px]"> {/* Adjust the height to center the message */}
          <p className="text-center text-lg">No open orders available.</p>
        </div>
      ) : (
        <>
          {/* Left Arrow */}
          <button
            onClick={() => containerRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
            className="absolute left-[-5%] top-[55%] transform -translate-y-1/2 z-20 p-2 rounded-full hidden sm:block"
          >
            <Image src="/Arrow-left.svg" alt="Scroll Left" width={40} height={40} />
          </button>

          <div
            ref={containerRef}
            className="h-80 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onScroll={handleScroll}
            style={{ whiteSpace: 'nowrap' }} // Ensure the children don't wrap
          >
            <div className="flex gap-6"> {/* Ensure flex layout for horizontal scroll */}
              {orderSample.map((order: any, index: number) => {
                const randomGradient = cardGradient[Math.floor(Math.random() * cardGradient.length)] || "/gradients2.svg";
                return (
                  <div
                    key={order.id}
                    className={`py-4 transition-all duration-500 z-10 flex-none ${index === currentIndex
                        ? "scale-110" // Center card is bigger with shadow
                        : "scale-100"
                      }`}
                  >
                    <div className="w-32 h-52 sm:w-44 sm:h-72 m-auto ml-4">
                      <OrderCard
                        id={order.requestId || order.listingId}
                        type={order.type}
                        amount={order.amount}
                        token={tokenImageMap[order.tokenAddress]?.image}
                        date={order.returnDateFormatted}
                        icon1={"/edit.svg"}
                        icon2={"/delete.svg"}
                        isSelected={currentIndex === index}
                        cardGradient={randomGradient}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => containerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
            className="absolute right-[-6%] top-[55%] transform -translate-y-1/2 z-20 p-2 rounded-full hidden sm:block"
          >
            <Image src="/Arrow-right.svg" alt="Scroll Right" width={40} height={40} />
          </button>
        </>
      )}
    </div>
  );
};
