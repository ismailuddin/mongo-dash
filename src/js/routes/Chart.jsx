import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import { useResizeDetector } from "react-resize-detector";
import TimeseriesLine from "../components/TimeseriesLine";
import Button from "../components/Button";
import PuffLoader from "react-spinners/PuffLoader";
import Icons from "../components/Icons";

export default function Chart({
    chart,
    lastUpdated,
}) {
    const { width, height, ref } = useResizeDetector();
    let mostRecentUpdate = new Date();
    const [plotData, setPlotData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeFilter, setTimeFilter] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const since1hr = () => {
        let now = new Date();
        now = now.setHours(now.getHours() - 1);
        setTimeFilter(now);
    }
    
    const since1day = () => {
        let now = new Date();
        now = now.setDate(now.getDate() - 1);
        setTimeFilter(now);
    }

    const since1wk = () => {
        let now = new Date();
        now = now.setDate(now.getDate() - 7);
        setTimeFilter(now);
    }

    const since1mo = () => {
        let now = new Date();
        now = now.setDate(now.getDate() - 28);
        setTimeFilter(now);
    }

    const since3mo = () => {
        let now = new Date();
        now = now.setDate(now.getDate() - 84);
        setTimeFilter(now);
    }

    const formatData = (data) => {
        const groupedData = [];
        const uniqueKeys = [...new Set(data.map((d) => d.groupby))];
        uniqueKeys.forEach((key) => {
            const filtered = data.filter((d) => d.groupby == key);
            groupedData.push({
                name: key,
                x: filtered.map((d) => d.x),
                y: filtered.map((d) => d.y),
                type: "scatter",
                mode: "lines+markers",
            });
        });
        return groupedData;
    };
    const getPlotData = async (showLoading = true, cancelToken) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            const { data } = await axios.get("/api/pipelines/run", {
                cancelToken: cancelToken.token,
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
            if (!axios.isCancel(error)) {
                setErrMsg("Error running pipeline!");
            }
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        getPlotData(true, cancelToken);
        setErrMsg(null);
        setSuccessMsg(null);
        return () => {
            cancelToken.cancel();
        }
    }, [timeFilter]);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        getPlotData(false, cancelToken);
        return () => {
            cancelToken.cancel();
        }
    }, [lastUpdated]);

    return (
        <div ref={ref} className="group h-full flex flex-col">
            <div
                style={{ cursor: "grab" }}
                className="flex justify-between items-start flex-shrink dragHandle"
            >
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
                            onClick={since1hr}
                        >
                            1 h
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={since1day}
                        >
                            1 d
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={since1wk}
                        >
                            1 wk
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={since1mo}
                        >
                            1 mo
                        </Button.GreyXS>
                        <Button.GreyXS
                            onClick={since3mo}>
                            3 mo
                        </Button.GreyXS>
                    </div>
                    <div className="text-right mt-1 pr-1">
                        <p className="font-light text-xs text-blueGray-400">
                            Last updated{" "}
                            {DateTime.fromJSDate(mostRecentUpdate).toFormat(
                                "H:m:s"
                            )}
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
                <TimeseriesLine
                    width={width - 25}
                    height={height - 40}
                    data={plotData}
                />
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
