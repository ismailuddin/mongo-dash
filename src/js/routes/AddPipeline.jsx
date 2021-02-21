import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import PipelineStages from "../components/PipelineStages";



export default function AddPipeline() {
    const [collections, setCollections] = useState([]);
    const [collection, setCollection] = useState(null);
    const [pipelineName, setPipelineName] = useState("");
    const [pipelineStages, setPipelineStages] = useState("");
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        const getCollections = async () => {
            const result = await axios.get("/api/get_collections");
            setCollections(result.data);
            setCollection(result.data[0]);
        };
        getCollections();
    }, []);

    const registerPipeline = async () => {
        try {
            await axios.post("/api/pipelines/register", {
                name: pipelineName,
                collection: collection,
                stages: pipelineStages
            });
            setErrMsg(null);
            setSuccessMsg("Pipeline successfully registered!");
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
                Add pipeline
            </h2>
            <p className="text-blueGray-800 mb-4">
                Fill in the details below to add a pipeline.
            </p>
            <div className="w-4/12">
                <Input.Text
                    name="Pipeline name"
                    value={pipelineName}
                    onChange={e => setPipelineName(e.target.value)}
                />
            </div>
            <div className="w-4/12">
                <Input.Select
                    name="Collections"
                    value={collection}
                    values={collections.map(c => [c,c])}
                    onChange={e => setCollection(e.target.value)}
                />
            </div>
            <label
                class="block text-sm font-medium text-blueGray-600 mb-1"
            >
                Pipeline stages
            </label>
            <PipelineStages
                value={pipelineStages}
                onChange={v => setPipelineStages(v)}
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
            <Button onClick={registerPipeline}>
                Register pipeline
            </Button>
        </div>
    );
}
