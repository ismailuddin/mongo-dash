import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Button from "../components/Button";
import Chart from "./Chart";
import Icons from "../components/Icons";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ViewDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState(null);
    // const [charts, setCharts] = useState({});
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get(`/api/dashboards/view`, {
                params: { dashboard_id: dashboardId },
            });
            setDashboard(result.data);
            // let _charts = result.data;
            // _charts = Object.fromEntries(_charts.map(c => [c.id, c]));
            // setCharts(_charts);
        };
        getData();
    }, [dashboardId]);
    if (dashboard == null) {
        return null;
    }
    const layouts = {
        lg: [
            { i: "a", x: 0, y: 0, w: 1, h: 2 },
            { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
            { i: "c", x: 4, y: 0, w: 4, h: 12, minW: 4, minH: 12 },
        ],
    };
    return (
        <>
            <div className="bg-white p-4 border-b border-blueGray-200 flex justify-between">
                <h2 className="text-3xl text-blueGray-800 font-bold leading-normal">
                    <span className="font-light">Dashboard | </span>
                    {dashboard.name}
                </h2>
                <div className="rounded-md bg-white px-2 flex items-center">
                    <Link to={`/dashboards/edit/${dashboardId}`}>
                        <Button.Primary>Edit dashboard</Button.Primary>
                    </Link>
                    <Button.Primary onClick={() => setLastUpdated(new Date())}>
                        <Icons.Refresh className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-45" />
                    </Button.Primary>
                </div>
            </div>
            <div className="w-full p-4">
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    cols={12}
                    rowHeight={30}
                    // width={1200}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    // onResizeStop={() => setLastUpdated(new Date())}
                >
                    <div
                        className="p-3 bg-white rounded-md m-2"
                        key="a"
                    >
                        a
                    </div>
                    <div
                        className="p-3 bg-white rounded-md m-2"
                        key="b"
                    >
                        b
                    </div>
                    <div
                        className="p-3 bg-white rounded-md m-2"
                        key="c"
                    >
                        <Chart
                            key={dashboard.charts[1].id}
                            chart={dashboard.charts[1]}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                </ResponsiveGridLayout>
            </div>
            <div className="p-4 grid grid-cols-12 gap-4">
                {dashboard.charts.map((chart, i) => (
                    <div className="p-3 bg-white col-span-6 rounded-md">
                        <Chart
                            key={chart.id}
                            chart={chart}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
