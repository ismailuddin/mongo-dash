import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Button from "../components/Button";
import Chart from "./Chart";
import Icons from "../components/Icons";
import classNames from "classnames";

function GoLive({ isLive, toggleGoLive }) {
    const classes = classNames(
        "relative rounded-md border px-4 py-2 box-border border-green-500 font-semibold focus:outline-none my-2 text-sm mr-2 transition duration-300",
        {
            "bg-white": isLive,
            "text-green-600": isLive,
            "hover:bg-green-500": isLive,
            "hover:text-white": isLive,
            "bg-green-500": !isLive,
            "text-black": !isLive,
            "hover:bg-green-400": !isLive,
            "hover:border-green-400": !isLive,
        }
    );
    return (
        <button onClick={toggleGoLive} className={classes}>
            {isLive && (
                <span class="absolute flex h-3 w-3 right-0 top-0 -mt-1 -mr-1">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            )}
            {isLive ? "LIVE" : "Go live"}
        </button>
    );
}

export default function ViewDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [timeFilter, setTimeFilter] = useState(null);

    const toggleGoLive = () => {
        if (!isLive) {
            window.interval = setInterval(() => {
                const now = new Date();
                setTimeFilter(now.setHours(now.getHours() - 1));
            }, 30 * 1000);
        } else {
            clearInterval(window.interval);
        }
        setIsLive(!isLive);
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get(`/api/dashboards/view`, {
                params: { dashboard_id: dashboardId },
            });
            setDashboard(result.data);
        };
        getData();
    }, [dashboardId]);
    if (dashboard == null) {
        return null;
    }
    return (
        <>
            <div className="bg-white p-4 border-b border-blueGray-200 flex justify-between">
                <h2 className="text-3xl text-blueGray-800 font-bold leading-normal">
                    <span className="font-light">Dashboard | </span>
                    {dashboard.name}
                </h2>
                <div className="rounded-md bg-white px-2 flex items-center">
                    <GoLive isLive={isLive} toggleGoLive={toggleGoLive} />
                    <Link to={`/dashboards/edit/${dashboardId}`}>
                        <Button.Primary>Edit dashboard</Button.Primary>
                    </Link>
                    <Button.Primary onClick={() => setLastUpdated(new Date())}>
                        <Icons.Refresh className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-45" />
                    </Button.Primary>
                </div>
            </div>
            <div className="p-4 grid grid-cols-12 gap-4">
                {dashboard.charts.map((chart, i) => (
                    <div className="p-3 bg-white col-span-6 rounded-md">
                        <Chart
                            key={chart.id}
                            chart={chart}
                            lastUpdated={lastUpdated}
                            incomingTimeFilter={timeFilter}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
