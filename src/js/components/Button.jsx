import React from "react";

function Primary({ children, onClick }) {
    return (
        <button
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-sm rounded-md font-semibold focus:outline-none transition-colors my-2 mr-2 group"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function Danger({ children, onClick }) {
    return (
        <button
            className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-sm rounded-md font-semibold focus:outline-none transition-colors my-2 mr-2 group"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function GreyXS({ children, onClick }) {
    return (
        <button
            className="px-2 py-1 bg-blueGray-200 rounded-md text-xs font-semibold text-blueGray-600 hover:bg-green-500 hover:text-black transition-colors focus:outline-none"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

const Button = {
    Primary,
    Danger,
    GreyXS
};

export default Button;
