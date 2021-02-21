import React from "react";

function Text({ name, value, onChange }) {
    return (
        <div className="my-2">
            <label
                for={name}
                className="block text-sm font-medium text-blueGray-600"
            >
                {name}
            </label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 border focus:ring-green-100 focus:outline-none focus:border-green-600 focus:ring-4 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3"
            />
        </div>
    );
}

function Select({ name, values, value, onChange }) {
    return (
        <div className="my-2">
            <label
                for={name}
                className="block text-sm font-medium text-blueGray-600"
            >
                {name}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full py-2 px-3 border border-blueGray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-100 focus:border-green-600 focus:ring-4 sm:text-sm"
            >
                {values.map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
        </div>
    );
}

const Input = {
    Select,
    Text
};

export default Input;
