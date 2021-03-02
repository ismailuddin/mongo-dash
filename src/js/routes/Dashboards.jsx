import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Switch,
    Route,
    useRouteMatch,
    useLocation,
    NavLink,
} from "react-router-dom";
import toast from "react-hot-toast";
import Icons from "../components/Icons";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import ViewDashboard from "../routes/ViewDashboard";
import EditDashboard from "./EditDashboard";

function DashboardsHome() {
    const location = useLocation();
    let match = useRouteMatch();
    const [showModal, setShowModal] = useState(false);
    const [dashboardName, setDashboardName] = useState("");
    const [dashboards, setDashboards] = useState([]);

    const getDashboards = async () => {
        const result = await axios.get("/api/dashboards/view_all");
        setDashboards(result.data);
    };
    useEffect(() => {
        getDashboards();
    }, [location.key]);

    const createDashboard = async () => {
        try {
            await axios.post("/api/dashboards/create", {
                name: dashboardName,
            });
            setShowModal(false);
            toast.success("Dashboard created!");
            getDashboards();
        } catch (error) {
            if (error.response.status == 422) {
                toast.error("Error validating fields. Please try again!");
            }
        }
    };

    return (
        <>
            <div className="bg-white p-4 border-b border-blueGray-200">
                <h2 className="text-3xl text-blueGray-800 font-bold mb-4">
                    Dashboards
                </h2>
                <p className="text-blueGray-800 mb-2">
                    Below is a list of your dashboards.
                </p>
            </div>
            <div className="p-4 h-full">
                <div className="grid grid-cols-6 my-4 gap-4">
                    {dashboards.map((dashboard) => (
                        <NavLink
                            key={dashboard._id}
                            to={`${match.path}/view/${dashboard._id}`}
                        >
                            <div className="rounded-md border border-blueGray-200 bg-white p-2">
                                <h4 className="text-md font-bold inline-block mb-0">
                                    {dashboard.name}
                                </h4>
                                <hr className="border-t border-blueGray-200 my-2" />
                                <h6 className="text-blueGray-400 font-bold uppercase text-xs">
                                    Database name
                                </h6>
                                <h4 className="text-blueGray-800 text-sm">
                                    {dashboard.database_name}
                                </h4>
                            </div>
                        </NavLink>
                    ))}
                </div>
                <Button.Primary onClick={() => setShowModal(true)}>
                    <div className="flex items-center">
                        <Icons.Plus className="h-4 w-4 mr-2" />
                        Add new dashboard
                    </div>
                </Button.Primary>
                <Modal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    title="Add new dashboard"
                >
                    <p className="text-blueGray-800 mb-4">
                        Fill in the details below to add a dashboard.
                    </p>
                    <div className="w-4/12">
                        <Input.Text
                            name="Dashboard name"
                            value={dashboardName}
                            onChange={(e) => setDashboardName(e.target.value)}
                        />
                    </div>
                    <Button.Primary onClick={createDashboard}>
                        <div className="flex items-center">
                            <Icons.Plus className="h-4 w-4 mr-2" />
                            Create dashboard
                        </div>
                    </Button.Primary>
                </Modal>
            </div>
        </>
    );
}

export default function Dashboards() {
    let match = useRouteMatch();
    return (
        <div className="w-full h-full">
            <Switch>
                <Route path={`${match.path}/edit/:dashboardId`}>
                    <EditDashboard />
                </Route>
                <Route path={`${match.path}/view/:dashboardId`}>
                    <ViewDashboard />
                </Route>
                <Route path={`${match.path}`}>
                    <DashboardsHome />
                </Route>
            </Switch>
        </div>
    );
}
