import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Icons from "../components/Icons";
import classNames from "classnames";
import useClickOutside from "../hooks/useClickOutside";

const DatabaseSelector = ({ databases, currentDatabase }) => {
    const ref = useRef();
    useClickOutside(ref, () => {
        setVisible(false);
    });

    const setDatabase = async (databaseName) => {
        try {
            await axios.get("/api/set_database", {
                params: {
                    database: databaseName
                }
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
    const truncate = string => {
        if (string.length > 15) {
            return `${string.slice(0, 15)}...`
        } else {
            return string;
        }
    }
    const [visible, setVisible] = useState(false);
    const dropdownClassnames = classNames(
        "absolute mt-1 top-10 left-0 right-0 rounded-md overflow-hidden bg-white border border-blueGray-200 transition transform duration-300".split(" "),
        {
            "-translate-y-12": !visible,
            "opacity-0": !visible,
            "opacity-100": visible,
            "visible": visible,
            "invisible": !visible,
            "translate-y-0": visible,
        }
    )
    return (
        <div className="w-full relative" ref={ref}>
            <button
                className="bg-blueGray-200 rounded-md px-4 py-2 flex items-center justify-between text-sm hover:bg-blueGray-100 transition-colors duration-300 focus:outline-none"
                onClick={() => setVisible(!visible)}
            >
                <div className="flex items-center">
                    <Icons.Database className="w-4 h-4 text-blueGray-500 mr-2 stroke-2" />
                    Select database
                </div>
                <Icons.ChevronDown className="ml-4 h-4 w-4" />
            </button>
            <div className={dropdownClassnames}>
                <ul>
                    {databases.map(database => (
                        <li>
                            <button
                                className="group p-2 text-left text-sm hover:bg-green-500 w-full focus:outline-none overflow-ellipsis flex items-center rounded-none"
                                onClick={() => setDatabase(database)}
                            >
                                {database == currentDatabase ? (
                                    <Icons.TickCircle className="w-4 h-4 mr-2 text-green-500 group-hover:text-black stroke-2" />
                                ) : (
                                    <Icons.Database className="w-4 h-4 text-blueGray-500 mr-2 stroke-2" />
                                )}
                                {truncate(database)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function Header() {
    const [databases, setDatbases] = useState([]);
    const [currentDatabase, setCurrentDatabase] = useState("");
    const getDatabases = async () => {
        try {
            const databasesData = await axios.get("/api/get_databases");
            setDatbases(databasesData.data.filter(d => d != "MongoDBViz"));
            const currentDatabaseData = await axios.get("/api/get_current_database");
            setCurrentDatabase(currentDatabaseData.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getDatabases();
    }, []);
    return (
        <div
            id="header"
            className="px-6 flex justify-between bg-white z-10 border-b border-blueGray-200"
        >
            <div className="h-14 flex items-center">
                <NavLink to="/">
                    <h3 className="text-lg font-bold text-green-600 mr-4">
                        Mongo Dash
                    </h3>
                </NavLink>
                <NavLink
                    to="/dashboards"
                    activeClassName="text-green-600 border-green-500"
                    className="px-3 font-bold h-full flex items-center border-b-4 border-white hover:border-green-500 transition-colors duration-300"
                >
                    Dashboards
                </NavLink>
                <NavLink
                    to="/pipelines"
                    activeClassName="text-green-600 border-green-500"
                    className="px-3 font-bold h-full flex items-center border-b-4 border-white hover:border-green-500 transition-colors duration-300"
                >
                    Pipelines
                </NavLink>
            </div>
            <div className="flex items-center">
                <DatabaseSelector
                    databases={databases}
                    currentDatabase={currentDatabase}
                />
            </div>
        </div>
    );
}
