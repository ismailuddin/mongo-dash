import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import Input from "../components/Input";
import PuffLoader from "react-spinners/PuffLoader";
import { useLocation, useHistory } from "react-router-dom";
import Button from "../components/Button";
import TimeseriesLine from "../components/TimeseriesLine";

export default function AddChart({ dashboardId, reloadCharts }) {
    const history = useHistory();
    const location = useLocation();
    const [chartName, setChartName] = useState("");
    const [loading, setLoading] = useState(false);
    const [pipelineId, setPipelineId] = useState(null);
    const [chartType, setChartType] = useState("TimeseriesLine");
    const [pipelines, setPipelines] = useState([]);
    const [plotData, setPlotData] = useState([]);
    const [pipeline, setPipeline] = useState({
        pipeline_id: null,
        name: null,
        collection: null,
        stages: null,
    });

    const getPipelines = async () => {
        try {
            const result = await axios.get("/api/pipelines/view_all");
            setPipelines(result.data);
            setPipelineId(result.data[0]._id);
            getPipeline(result.data[0]._id);
            getPlotData(result.data[0]._id);
        } catch (error) {
            toast.error("Error getting pipelines!");
            console.error(error);
        }
    };
    const getPipeline = async (pipelineId) => {
        try {
            const result = await axios.get(`/api/pipelines/view`, {
                params: { pipeline_id: pipelineId },
            });
            setPipeline(result.data);
        } catch (error) {
            toast.error("Error retrieving pipeline details");
        }
    };
    const getPlotData = async (pipelineId) => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/pipelines/run", {
                params: {
                    pipeline_id: pipelineId,
                    limit: 5000
                },
            });
            const groupedData = [];
            const uniqueKeys = [...new Set(data.map(d => d.groupby))];
            uniqueKeys.forEach(key => {
                const filtered = data.filter(d => d.groupby == key);
                groupedData.push({
                    name: key,
                    x: filtered.map(d => d.x),
                    y: filtered.map(d => d.y),
                    type: "scatter",
                    mode: "lines",
                })
            });
            setPlotData(groupedData);
            setLoading(false);
        } catch (error) {
            toast.error("Error running pipeline!");
            setLoading(false);
        }
    };

    const createChart = async () => {
        try {
            const { data: chartId } = await axios.post("/api/dashboards/charts/add",
                {
                    name: chartName,
                    pipeline_id: pipelineId,
                    type_: "TimeseriesLine",
                    x_axis: {
                        label: "X-axis",
                        key: "x",
                    },
                    y_axis: {
                        label: "Y-axis",
                        key: "y",
                    },
                    grouping: "",
                },
                { params: { dashboard_id: dashboardId }}
            );
            toast.success("Chart successfully registered!");
            reloadCharts();
            history.push(`/dashboards/edit/${dashboardId}/charts/view/${chartId}`);
        } catch (error) {
            console.error(error);
            toast.error("Error registering chart!");
        }
    };

    useEffect(() => {
        getPipelines();
    }, [location.key]);

    return (
        <div className="p-4">
            <h2 className="text-3xl text-blueGray-800 font-bold mb-4">
                Add chart
            </h2>
            <p className="text-blueGray-800 mb-4">
                Fill in the details below to add a chart.
            </p>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    <Input.Text
                        name="Name"
                        value={chartName}
                        onChange={e => setChartName(e.target.value)}
                    />
                </div>
                <div className="col-span-4">
                    <Input.Select
                        name="Pipelines"
                        value={pipelineId}
                        values={pipelines.map((p) => [p._id, p.name])}
                        onChange={(e) => {
                            setPipelineId(e.target.value);
                            getPipeline(e.target.value);
                            getPlotData(e.target.value);
                        }}
                    />
                </div>
                <div className="col-span-4">
                    <Input.Select
                        name="Chart type"
                        value={chartType}
                        values={[["TimeseriesLine", "Timeseries line chart"]]}
                        onChange={(e) => setChartType(e.target.value)}
                    />
                </div>
                <div className="col-span-4">
                    <div className="border border-blueGray-200 p-3 inline-block rounded-md">
                        <h4 className="text-md text-blueGray-800 font-bold mb-2">
                            {pipeline.name}
                        </h4>
                        <div className="flex gap-x-8">
                            <div>
                                <h6 className="text-blueGray-400 font-bold uppercase text-xs">
                                    Database name
                                </h6>
                                <h4 className="text-blueGray-800 text-sm">
                                    {pipeline.database_name}
                                </h4>
                            </div>
                            <div>
                                <h6 className="text-blueGray-400 font-bold uppercase text-xs">
                                    Collection
                                </h6>
                                <h4 className="text-blueGray-800 text-sm">
                                    {pipeline.collection}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="flex w-full justify-center h-full py-14 items-center">
                    <PuffLoader color={"#22C55E"} loading={loading} size={80} />
                </div>
            )}
            <div className="mb-2">
                {!loading && plotData.length > 0 && <TimeseriesLine height={300} data={plotData} />}
                {!loading && plotData.length == 0 && (
                    <div className="py-24 flex items-center justify-center">
                        <h4 className="text-lg text-blueGray-400 font-semibold">
                            No data found!
                        </h4>
                    </div>
                )}
            </div>
            <Button.Primary onClick={createChart}>Save chart</Button.Primary>
        </div>
    );
}
