import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Button from "../components/Button";
import Chart from "./Chart";
import Icons from "../components/Icons";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function ViewDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState(null);
    const [charts, setCharts] = useState({});
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get(`/api/dashboards/view`, {
                params: { dashboard_id: dashboardId },
            });
            setDashboard(result.data);
            let _charts = result.data;
            _charts = Object.fromEntries(_charts.map(c => [c.id, c]));
            setCharts(_charts);
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
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
