import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import classNames from "classnames";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "../../css/override.css";
import Button from "../components/Button";
import Chart from "./Chart";
import Icons from "../components/Icons";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isLive, setIsLive] = useState(false);
    // const [timeFilter, setTimeFilter] = useState(null);
    const [layoutStore, setLayoutStore] = useState({});
    const resizeHandler = (
        <div
            style={{ cursor: "nwse-resize" }}
            className="absolute right-0 bottom-0 h-6 w-6 rounded-full border border-blueGray-200 bg-white text-xs flex items-center justify-center p-1 shadow-md"
        >
            <div className="h-2 w-2 border-b-2 border-r-2 border-blueGray-400"></div>
        </div>
    );
    const toggleGoLive = () => {
        if (!isLive) {
            window.interval = setInterval(() => {
                const now = new Date();
                setLastUpdated(new Date());
                // setTimeFilter(now.setHours(now.getHours() - 1));
            }, 5 * 1000);
        } else {
            clearInterval(window.interval);
        }
        setIsLive(!isLive);
    };

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

    const layouts = { lg: dashboard.charts.map((chart, i) => {
        return {
            i: chart.id,
            x: (i * 6) % 12,
            y: Math.floor(i / 2) * 6,
            w: 6,
            h: 6,
            minW: 4,
            minH: 4,
        };
    })};

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
            <div className="w-full h-full p-0">
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    draggableHandle=".dragHandle"
                    rowHeight={50}
                    resizeHandle={resizeHandler}
                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                    }}
                    onLayoutChange={layout => setLayoutStore(layout)}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                >
                    {layouts.lg.map((layout, i) => (
                        <div key={layout.i} className="p-2">
                            <div className="p-4 bg-white rounded-md w-full h-full">
                                <Chart
                                    chart={dashboard.charts[i]}
                                    lastUpdated={lastUpdated}
                                    // incomingTimeFilter={timeFilter}
                                />
                            </div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </>
    );
}
