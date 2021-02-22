import React from "react";

export default function Button({ children, onClick}) {
    return (
        <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md focus:outline-none transition-colors my-2 mr-2"
            onClick={onClick}
        >
            {children}    
        </button>
    );
}
