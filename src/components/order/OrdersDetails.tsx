import { CreateOrder } from "./CreateOrder";
import { FilledOrder } from "./FilledOrder";
import { OpenOrder } from "./OpenOrder";
import { useMemo } from "react";

interface Order {
    status: string;
    max_Amount: number;
    returnDate: number; 
}

const OrdersDetails = ({ orderSample }: any) => {
  
  // console.log("OrderSAMPLE", orderSample);

  const now = Date.now();

  const filledOrders = useMemo(() => 
    orderSample.filter((order: Order) =>
      order.status !== "OPEN" || 
      order.max_Amount === 0 || 
      order.returnDate < now
    ), [orderSample, now]
  );

  const openOrders = useMemo(() => 
    orderSample.filter((order: Order) =>
      (order.status === "OPEN" &&
      order.returnDate >= now) ||  
      order.max_Amount > 0 
    ), [orderSample, now]
  );

  return (
    <div className="bg-black py-6 w-full px-6 u-class-shadow-2">

      <div className="flex flex-col md:flex-row justify-between w-full gap-4 ">

        <div className="w-full md:w-[30%]">
          <FilledOrder orderSample={filledOrders} />
        </div>

        <div className="w-full md:w-[50%] py-8">
          <OpenOrder orderSample={openOrders} />
        </div>

        <div className="hidden md:flex w-[20%]">
          <CreateOrder />
        </div>
      </div>
    </div>
  );
};

export default OrdersDetails;
