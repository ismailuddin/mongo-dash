import React from "react";
import Icons from "../components/Icons";

export default function Modal({ title, children, visible, onClose }) {
    if (visible) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-20">
                <div className="bg-white p-4 rounded-md w-6/12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl text-blueGray-800 font-bold inline-block mb-0">
                            {title}
                        </h2>
                        <button onClick={onClose} className="rounded-full flex items-center justify-center h-6 w-6 bg-red-600 text-white focus:outline-none hover:bg-red-400 transition-colors duration-300">
                            <Icons.Cross className="w-4 h-4" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    } else {
        return null;
    }
}
