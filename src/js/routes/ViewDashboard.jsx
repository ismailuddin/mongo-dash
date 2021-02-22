import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouteMatch, Link } from "react-router-dom";
import Button from "../components/Button";

export default function ViewDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState({});

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
        <div className="">
            <h2 className="text-3xl text-blueGray-800 font-bold mb-4">
                <span className="font-light">Dashboard | </span>
                {dashboard.name}
            </h2>
            <p className="text-blueGray-800 mb-4">Below is your dashboard.</p>
            <div className="rounded-md bg-white px-2 flex items-center">
                <Link to={`/dashboards/edit/${dashboardId}`}>
                    <Button>Edit dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
