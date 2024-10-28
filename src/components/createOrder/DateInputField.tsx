"use client"
import { useState } from "react";

interface DateInputFieldProps {
    dateValue: string;
    setDateValue: (value: string) => void;
}

export const DateInputField = ({ dateValue, setDateValue }: DateInputFieldProps) => {

    const handleClear = () => {
        setDateValue(""); 
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateValue(e.target.value);
    };

    return (
        <div>
            <div className="w-full rounded-lg mt-4 text-black text-base font-normal font-[family-name:var(--font-inter)] relative cursor-pointer">
                {!dateValue && (
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        12.12.2022
                    </span>
                )}
                <input
                    type="date"
                    value={dateValue}
                    onChange={handleChange}
                    className="w-full outline-none border-none rounded-lg p-2 text-black cursor-pointer"
                    style={{ color: dateValue ? 'black' : 'transparent' }}
                />
    
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-9 top-1/2 transform -translate-y-1/2 text-xl"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
