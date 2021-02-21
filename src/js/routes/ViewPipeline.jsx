import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import PipelineStages from "../components/PipelineStages";


export default function ViewPipeline({ reloadPipelines }) {
    const { pipelineId } = useParams();
    const [collections, setCollections] = useState([]);
    const [pipeline, setPipeline] = useState({});
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const pipelineResult = await axios.get(`/api/pipelines/view`, {
                params: {pipeline_id: pipelineId}
            });
            setPipeline(pipelineResult.data);
            const collectionsResult = await axios.get("/api/get_collections");
            setCollections(collectionsResult.data);
        };
        getData();
    }, [pipelineId]);

    const editPipeline = async () => {
        try {
            await axios.post("/api/pipelines/edit", {
                pipeline_id: pipelineId,
                name: pipeline.name,
                collection: pipeline.collection,
                stages: pipeline.stages
            });
            setErrMsg(null);
            setSuccessMsg("Pipeline successfully updated!");
            reloadPipelines();
        } catch (error) {
            if (error.response.status == 422) {
                setErrMsg("Error validating fields. Please try again!");
                setSuccessMsg(null);
            }
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl text-blueGray-800 font-bold mb-4">
                <span className="font-light">Pipeline | </span>{pipeline.name}
            </h2>
            <p className="text-blueGray-800 mb-4">
                Edit the details of the pipeline below
            </p>
            <div className="w-4/12">
                <Input.Text
                    name="Pipeline name"
                    value={pipeline.name}
                    onChange={(e) =>
                        setPipeline({ ...pipeline, name: e.target.value })
                    }
                />
            </div>
            <div className="w-4/12">
                <Input.Select
                    name="Collections"
                    value={pipeline.collection}
                    values={collections.map((c) => [c, c])}
                    onChange={(e) =>
                        setPipeline({ ...pipeline, collection: e.target.value })
                    }
                />
            </div>
            <label class="block text-sm font-medium text-blueGray-600 mb-1">
                Pipeline stages
            </label>
            <PipelineStages
                value={pipeline.stages}
                onChange={(v) => setPipelineStages(v)}
                onChange={(v) =>
                    setPipeline({ ...pipeline, stages: v })
                }
            />
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
            <Button onClick={editPipeline}>Edit pipeline</Button>
        </div>
    );
}
