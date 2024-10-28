import Image from "next/image"
import Link from "next/link"

export const CreateOrder = () => {
  return (
    <div className="w-full my-auto ml-4">
      <div className="mt-12">
        <div className="bg-white rounded-xl text-[#262626] p-2 w-44 h-72 m-auto">
          <Link href={"/create-order"} className="rounded-xl border-2 border-dashed border-[#262626] w-full h-full flex flex-col items-center justify-center">
            <div className="mb-1">
              <Image src={"/plus.svg"} alt="token" width={24} height={24} priority quality={100} />
            </div>
            <div className="flex flex-col items-center">
              <div>Create</div>
              <div>New</div>
              <div>Order</div>
            </div>
          </Link>
      </div>
      </div>
    </div>
  )
}
