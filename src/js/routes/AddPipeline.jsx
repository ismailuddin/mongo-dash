import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";
import PipelineStagesEditor from "../components/PipelineStagesEditor";

export default function AddPipeline({ reloadPipelines }) {
    const history = useHistory();
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
            const { data: pipelineId } = await axios.post(
                "/api/pipelines/register",
                {
                    name: pipelineName,
                    collection: collection,
                    stages: pipelineStages,
                }
            );
            setErrMsg(null);
            toast.success("Pipeline successfully registered!");
            reloadPipelines();
            history.push(`/pipelines/view/${pipelineId}`);
        } catch (error) {
            if (error.response.status == 422) {
                toast.error("Error validating fields. Please try again!");
            }
        }
    };

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
                    onChange={(e) => setPipelineName(e.target.value)}
                />
            </div>
            <div className="w-4/12">
                <Input.Select
                    name="Collections"
                    value={collection}
                    values={collections.map((c) => [c, c])}
                    onChange={(e) => setCollection(e.target.value)}
                />
            </div>
            <label class="block text-sm font-medium text-blueGray-600 mb-1">
                Pipeline stages
            </label>
            <PipelineStagesEditor
                value={pipelineStages}
                onChange={(v) => setPipelineStages(v)}
            />
            <Button.Primary onClick={registerPipeline}>
                Register pipeline
            </Button.Primary>
        </div>
    );
}
