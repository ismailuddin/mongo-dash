import React from "react";

export default function Table() {
    return (
        <div className="rounded-lg w-full border border-blueGray-200 overflow-hidden">
            <table className="w-full">
                <thead className="rounded-md bg-blueGray-200 text-left">
                    <th className="px-4 py-2 font-semibold text-blueGray-700">
                        Name
                    </th>
                    <th className="px-4 py-2 font-semibold text-blueGray-700">
                        Collection
                    </th>
                    <th className="px-4 py-2 font-semibold text-blueGray-700"></th>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr className="group">
                        <td className="px-4 py-2">Pipeline 1</td>
                        <td className="px-4 py-2">EjectorUse</td>
                        <td className="px-4 py-2">
                            <div className="group-hover:visible group-hover:opacity-100 opacity-0 invisible flex items-center transition-opacity">
                                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 ring-green-200">
                                    Edit pipeline
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2">Pipeline 1</td>
                        <td className="px-4 py-2">EjectorUse</td>
                        <td className="px-4 py-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
