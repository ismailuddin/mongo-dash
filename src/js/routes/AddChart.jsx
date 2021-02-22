import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import { useRouteMatch, useLocation } from "react-router-dom";
import Button from "../components/Button";
import TimeseriesLine from "../components/TimeseriesLine";

export default function AddChart() {
    const location = useLocation();
    let match = useRouteMatch();
    const [pipelineId, setPipelineId] = useState(null);
    const [chartType, setChartType] = useState("TimeseriesLine");
    const [pipelines, setPipelines] = useState([]);
    const [pipeline, setPipeline] = useState({
        pipeline_id: null,
        name: null,
        collection: null,
        stages: null,
    });
    const [plotData, setPlotData] = useState([]);
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const getPipelines = async () => {
        try {
            const result = await axios.get("/api/pipelines/view_all");
            setPipelines(result.data);
            setPipelineId(result.data[0]._id);
            getPipeline(result.data[0]._id);
            getPlotData(result.data[0]._id);
        } catch (error) {
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
            setErrMsg("Error retrieving pipeline details");
            setSuccessMsg(null);
        }
    };
    const getPlotData = async (pipelineId) => {
        try {
            const { data } = await axios.get("/api/pipelines/run", {
                params: {
                    pipeline_id: pipelineId
                }
            });
            const x = data.map(d => d.x);
            const y = data.map(d => d.y);
            setPlotData([{
                x,
                y,
                type: 'scatter',
                mode: 'lines'
            }]);
            setErrMsg(null);
        } catch (error)  {
            setErrMsg("Error running pipeline!");
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
            <div className="grid grid-cols-12 gap-4 mb-2">
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
            </div>
            <div className="mb-2">
                <div
                    className="border border-blueGray-200 p-3 inline-block rounded-md"
                >
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
            {errMsg !== null ? (
                <div className="rounded-md p-4 bg-rose-200 my-2 text-red-800">
                    {errMsg}
                </div>
            ) : null}
            {successMsg !== null ? (
                <div className="rounded-md p-4 bg-emerald-100 my-2 text-green-800">
                    {successMsg}
                </div>
            ) : null}
            <div className="mb-2">
                <TimeseriesLine data={plotData}/>
            </div>
            <Button>Save chart</Button>
        </div>
    );
}
