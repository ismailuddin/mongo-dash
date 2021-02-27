import React, { useState, useEffect } from "react";
import axios from "axios";
import TimeseriesLine from "../components/TimeseriesLine";

export default function Chart({ chart }) {
    const [plotData, setPlotData] = useState([]);
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const getPlotData = async () => {
        try {
            const { data } = await axios.get("/api/pipelines/run", {
                params: {
                    pipeline_id: chart.pipeline_id,
                },
            });
            const groupedData = [];
            const uniqueKeys = [...new Set(data.map(d => d.grouping))];
            uniqueKeys.forEach(key => {
                const filtered = data.filter(d => d.grouping == key);
                groupedData.push({
                    name: key,
                    x: filtered.map(d => d.x),
                    y: filtered.map(d => d.y),
                    type: "scatter",
                    mode: "lines",
                })
            });
            setPlotData(groupedData);
            setErrMsg(null);
        } catch (error) {
            console.error(error);
            setErrMsg("Error running pipeline!");
        }
    };
    useEffect(() => {
        getPlotData();
        setErrMsg(null);
        setSuccessMsg(null);
    }, [location.key]);
    return (
        <div>
            <h4 className="font-semibold text-sm">{chart.name}</h4>
            
            <TimeseriesLine data={plotData} />
            {errMsg !== null ? (
                <div className="rounded-md p-4 bg-rose-200 my-2 text-red-800 text-sm">
                    {errMsg}
                </div>
            ) : null}
            {successMsg !== null ? (
                <div className="rounded-md p-4 bg-emerald-100 my-2 text-green-800 text-sm">
                    {successMsg}
                </div>
            ) : null}
        </div>
    );
}
