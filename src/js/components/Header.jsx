import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <div
            id="header"
            className="h-14 px-4 flex items-center bg-white z-10 border-b border-blueGray-200"
        >
            <h3 className="text-lg font-bold text-green-600 mr-4">
                MongoDB
                <span className="ml-2 font-light">Visualiser</span>
            </h3>
            <NavLink
                to="/dashboards"
                activeClassName="text-green-600 border-green-600"
                className="px-3 font-bold h-full flex items-center border-b-4 border-white hover:border-green-600 transition-colors duration-300"
            >
                Dashboards
            </NavLink>
            <NavLink
                to="/pipelines"
                activeClassName="text-green-600 border-green-600"
                className="px-3 font-bold h-full flex items-center border-b-4 border-white hover:border-green-600 transition-colors duration-300"
            >
                Pipelines
            </NavLink>
        </div>
    );
}
