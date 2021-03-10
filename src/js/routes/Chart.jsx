import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import TimeseriesLine from "../components/TimeseriesLine";
import Button from "../components/Button";
import PuffLoader from "react-spinners/PuffLoader";
import Icons from "../components/Icons";

export default function Chart({
    chart,
    lastUpdated,
    incomingTimeFilter = null,
}) {
    let mostRecentUpdate = new Date();
    const now = new Date();
    const [plotData, setPlotData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [internalLastUpdate, setInternalLastUpdate] = useState(new Date());
    const [timeFilter, setTimeFilter] = useState(
        now.setDate(now.getDate() - 1)
    );
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const formatData = (data) => {
        const groupedData = [];
        const uniqueKeys = [...new Set(data.map((d) => d.grouping))];
        uniqueKeys.forEach((key) => {
            const filtered = data.filter((d) => d.grouping == key);
            groupedData.push({
                name: key,
                x: filtered.map((d) => d.x),
                y: filtered.map((d) => d.y),
                type: "scatter",
                mode: "lines",
            });
        });
        return groupedData;
    };
    const getPlotData = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            const { data } = await axios.get("/api/pipelines/run", {
                params: {
                    pipeline_id: chart.pipeline_id,
                    from_timestamp: timeFilter,
                },
            });
            const groupedData = formatData(data);
            setPlotData(groupedData);
            if (showLoading) {
                setLoading(false);
            }
            setErrMsg(null);
        } catch (error) {
            console.error(error);
            setErrMsg("Error running pipeline!");
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getPlotData();
        setErrMsg(null);
        setSuccessMsg(null);
    }, [location.key]);

    useEffect(() => {
        getPlotData(false);
        setInternalLastUpdate(new Date());
        mostRecentUpdate = new Date(
            Math.max(...[lastUpdated, new Date()])
        );
    }, [lastUpdated, timeFilter]);

    useEffect(() => {
        if (incomingTimeFilter !== null) {
            setTimeFilter(incomingTimeFilter);
        }
    }, [incomingTimeFilter]);

    return (
        <div className="group h-full flex flex-col">
            <div className="flex justify-between items-start flex-shrink">
                <h4 className="font-semibold text-md mb-0">{chart.name}</h4>
                <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                    <div className="flex gap-x-1">
                        <Button.GreyXS onClick={() => getPlotData()}>
                            <Icons.Refresh className="h-4 w-4" />
                        </Button.GreyXS>
                        <Button.GreyXS onClick={() => setTimeFilter(null)}>
                            -/-
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={() =>
                                setTimeFilter(now.setHours(now.getHours() - 1))
                            }
                        >
                            1 h
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={() =>
                                setTimeFilter(now.setDate(now.getDate() - 1))
                            }
                        >
                            1 d
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={() =>
                                setTimeFilter(now.setDate(now.getDate() - 7))
                            }
                        >
                            1 wk
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={() =>
                                setTimeFilter(now.setDate(now.getDate() - 28))
                            }
                        >
                            1 mo
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={() =>
                                setTimeFilter(now.setDate(now.getDate() - 84))
                            }
                        >
                            3 mo
                        </Button.GreyXS>
                    </div>
                    <div className="text-right mt-1 pr-1">
                        <p className="font-light text-xs text-blueGray-400">
                            Last updated{" "}
                            {DateTime.fromJSDate(mostRecentUpdate).toFormat("H:m:s")}
                        </p>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="flex w-full justify-center h-full py-14 items-center">
                    <PuffLoader color={"#22C55E"} loading={loading} size={80} />
                </div>
            )}
            {!loading && plotData.length > 0 && (
                <TimeseriesLine data={plotData} />
            )}
            {!loading && plotData.length == 0 && (
                <div className="py-24 flex items-center justify-center h-full">
                    <h4 className="text-lg text-blueGray-400 font-semibold">
                        No data found within this time period!
                    </h4>
                </div>
            )}
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
