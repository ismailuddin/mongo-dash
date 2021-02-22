import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    useParams,
    useRouteMatch,
    NavLink,
    Link,
    Switch,
    Route,
} from "react-router-dom";
import Button from "../components/Button";
import AddChart from './AddChart';

export default function EditDashboard() {
    const { dashboardId } = useParams();
    let match = useRouteMatch();
    const [dashboard, setDashboard] = useState({ charts: [] });
    const { charts } = dashboard;

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
            <div className="bg-white p-4 border-b border-blueGray-200">
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
                    <Button>Edit dashboard name</Button>
                </div>
            </div>
            <div className="grid grid-cols-4 divide-x divide-blueGray-200 bg-white h-full">
                <div>
                    <div className="p-4">
                        <h2 className="text-3xl text-blueGray-800 font-bold mb-4">
                            Charts
                        </h2>
                        <p className="text-blueGray-800 mb-4">
                            Below is a list of charts included in this
                            dashboard.
                        </p>
                        <div className="my-4">
                            <Link
                                to={`${match.url}/charts/add`}
                            >
                                <Button>Add chart</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="border-t border-blueGray-200 divide-y divide-blueGray-200">
                        {charts.map((chart) => (
                            <NavLink
                                key={chart.id_}
                                to={`${match.url}/charts/${chart.id_}`}
                                className="block border-l-4 border-white p-4 hover:bg-blueGray-50 transition-colors duration-300"
                            >
                                <div>
                                    <h4 className="text-md text-blueGray-800 font-bold">
                                        {chart.name}
                                    </h4>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="col-span-3">
                    <Switch>
                        <Route path={`${match.url}/charts/add`}>
                            <AddChart />
                        </Route>
                        <Route path={`${match.url}/charts/view/:chartId`}>
                            View chart
                        </Route>
                        <Route path={`${match.url}`}>
                            <div className="w-full h-full flex items-center justify-center bg-blueGray-100">
                                Please select a chart
                            </div>
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}
