import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouteMatch, Link } from "react-router-dom";
import Button from "../components/Button";
import Chart from "./Chart";

export default function ViewDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState({charts: []});

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get(`/api/dashboards/view`, {
                params: { dashboard_id: dashboardId },
            });
            setDashboard(result.data);
        };
        getData();
    }, [dashboardId]);

    return (
        <>
            <div className="bg-white p-4 border-b border-blueGray-200 flex justify-between h-full">
                <h2 className="text-3xl text-blueGray-800 font-bold leading-normal">
                    <span className="font-light">Dashboard | </span>
                    {dashboard.name}
                </h2>
                <div className="rounded-md bg-white px-2 flex items-center">
                    <Link to={`/dashboards/edit/${dashboardId}`}>
                        <Button>Edit dashboard</Button>
                    </Link>
                </div>
            </div>
            <div className="p-4 grid grid-cols-12 gap-4">
                {dashboard.charts.map(chart => (
                    <div className="col-span-4 rounded-md bg-white p-3">
                        <Chart chart={chart} />
                    </div>
                ))}
            </div>
        </>
    );
}
