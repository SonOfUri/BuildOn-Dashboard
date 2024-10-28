import BorrowAllocationPage from "@/components/allocation/BorrowAllocation";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BorrowAllocationPage />
        </Suspense>
    );
}
