import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";
import PipelineStagesEditor from "../components/PipelineStagesEditor";
import PipelinePreview from "../components/PipelinePreview";


export default function AddPipeline({ reloadPipelines }) {
    const history = useHistory();
    const [collections, setCollections] = useState([]);
    const [collection, setCollection] = useState(null);
    const [pipelineName, setPipelineName] = useState("");
    const [pipelineStages, setPipelineStages] = useState("");
    const [pipelineResult, setPipelineResult] = useState("");


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
            toast.success("Pipeline successfully registered!");
            reloadPipelines();
            history.push(`/pipelines/view/${pipelineId}`);
        } catch (error) {
            if (error.response.status == 422) {
                toast.error("Error validating fields. Please try again!");
            }
        }
    };
    const previewPipeline = async () => {
        try {
            const { data } = await axios.post("/api/pipelines/run_arbitrary", {
                name: pipelineName,
                collection: collection,
                stages: pipelineStages,
            });
            setPipelineResult(JSON.stringify(data, null, 1));
        } catch (error) {
            console.error(error);
            toast.error("Error running pipeline!");
        }
    };

    return (
        <div className="p-4 bg-white">
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
            <div className="flex mb-4">
                <Button.Primary onClick={registerPipeline}>
                    Register pipeline
                </Button.Primary>
                <Button.Primary onClick={previewPipeline}>
                    Preview pipeline
                </Button.Primary>
            </div>
            <h4 className="text-xl text-blueGray-800 font-bold mb-4">
                Pipeline preview
            </h4>
            <PipelinePreview value={pipelineResult} />
        </div>
    );
}
