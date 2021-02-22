import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink, Link } from "react-router-dom";
import Button from "../components/Button";

export default function EditDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState({charts:[]});
    const { charts } = dashboard;
    console.log(dashboard);

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
                <span className="font-light">Edit dashboard | </span>
                {dashboard.name}
            </h2>
            <p className="text-blueGray-800 mb-4">
                Below is your dashboard.
            </p>
            <div className="rounded-md bg-white px-2 flex items-center mb-4">
                <Link to={`/dashboards/view/${dashboardId}`}>
                    <Button>View dashboard</Button>
                </Link>
                <Button>Add chart</Button>
                <Button>Edit dashboard name</Button>
            </div>
            <h3 className="text-2xl text-blueGray-800 font-bold mb-4">
                Charts
            </h3>
            <div className="grid grid-cols-6 my-4 gap-4">
                {charts.map((chart) => (
                    <NavLink
                        key=""
                        to=""
                    >
                        <div className="rounded-md border border-blueGray-200 bg-white p-2 shadow-lg">
                            <h4 className="text-md font-bold inline-block mb-0">
                                {chart.name}
                            </h4>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
