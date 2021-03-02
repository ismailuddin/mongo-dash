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
import toast from 'react-hot-toast';
import Button from "../components/Button";
import Input from "../components/Input";
import AddChart from "./AddChart";
import ViewChart from "./ViewChart";
import Modal from "../components/Modal";

export default function EditDashboard() {
    const { dashboardId } = useParams();
    let match = useRouteMatch();
    const [showModal, setShowModal] = useState(false);
    const [dashboardName, setDashboardName] = useState("");
    const [dashboard, setDashboard] = useState({ charts: [] });

    const getData = async () => {
        const result = await axios.get(`/api/dashboards/view`, {
            params: { dashboard_id: dashboardId },
        });
        setDashboard(result.data);
        setDashboardName(result.data.name);
    };
    useEffect(() => {
        getData();
    }, [dashboardId]);
    const editDashboardName = async () => {
        try {
            await axios.patch("/api/dashboards/edit", {
                name: dashboardName,
                dashboard_id: dashboardId
            });
            setShowModal(false);
            getData();
            toast.success("Dashboard name successfully updated!")
        } catch (error) {
            if (error.response.status == 422) {
                toast.error("Dashboard name successfully updated!")
            }
        }
    };

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
                        <Button.Primary>View dashboard</Button.Primary>
                    </Link>
                    <Button.Primary onClick={() => setShowModal(true)}>
                        Edit dashboard name
                    </Button.Primary>
                </div>
                <Modal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    title="Edit dashboard"
                >
                    <p className="text-blueGray-800 mb-4">
                        Edit your dashboard name.
                    </p>
                    <div className="w-4/12">
                        <Input.Text
                            name="Dashboard name"
                            value={dashboardName}
                            onChange={(e) => setDashboardName(e.target.value)}
                        />
                    </div>
                    <Button.Primary onClick={editDashboardName}>
                        Update dashboard name
                    </Button.Primary>
                </Modal>
            </div>
            <div className="grid grid-cols-4 divide-x divide-blueGray-200 bg-white h-full">
                <div className="col-span-1">
                    <div className="p-4">
                        <h2 className="text-3xl text-blueGray-800 font-bold mb-4">
                            Charts
                        </h2>
                        <p className="text-blueGray-800 mb-4">
                            Below is a list of charts included in this
                            dashboard.
                        </p>
                        <div className="my-4">
                            <Link to={`${match.url}/charts/add`}>
                                <Button.Primary>Add chart</Button.Primary>
                            </Link>
                        </div>
                    </div>
                    <div className="border-t border-blueGray-200">
                        {dashboard.charts.map((chart) => (
                            <NavLink
                                key={chart.id}
                                to={`${match.url}/charts/view/${chart.id}`}
                                activeClassName="border-green-600"
                                className="block border-l-4 border-white hover:bg-blueGray-50 transition-colors duration-300"
                            >
                                <div className="p-4 border-b border-blueGray-200">
                                    <h4 className="text-md text-blueGray-800 font-bold">
                                        {chart.name}
                                    </h4>
                                    <p className="text-sm text-blueGray-600">
                                        {chart.type_}
                                    </p>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="col-span-3 overflow-y-scroll">
                    <Switch>
                        <Route path={`${match.url}/charts/add`}>
                            <AddChart
                                dashboardId={dashboardId}
                                reloadCharts={getData}
                            />
                        </Route>
                        <Route path={`${match.url}/charts/view/:chartId`}>
                            <ViewChart
                                dashboardId={dashboardId}
                                reloadCharts={getData}
                            />
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
