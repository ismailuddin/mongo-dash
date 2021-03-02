import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import Input from "../components/Input";
import Button from "../components/Button";
import PipelineStagesEditor from "../components/PipelineStagesEditor";
import PipelinePreview from "../components/PipelinePreview";


export default function ViewPipeline({ reloadPipelines }) {
    const { pipelineId } = useParams();
    const [collections, setCollections] = useState([]);
    const [pipelineResult, setPipelineResult] = useState("");
    const [pipeline, setPipeline] = useState({
        pipeline_id: null,
        name: null,
        collection: null,
        stages: null
    });

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
            toast.success("Pipeline successfully updated!");
            reloadPipelines();
        } catch (error) {
            if (error.response.status == 422) {
                toast.error("Error validating fields. Please try again!");
            }
        }
    }
    const previewPipeline = async () => {
        try {
            const { data } = await axios.post("/api/pipelines/run_arbitrary", {
                name: pipeline.name,
                collection: pipeline.collection,
                stages: pipeline.stages
            });
            setPipelineResult(JSON.stringify(data, null, 1));
        } catch (error) {
            console.error(error);
            toast.error("Error running pipeline!");
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
            <label className="block text-sm font-medium text-blueGray-600 mb-1">
                Pipeline stages
            </label>
            <PipelineStagesEditor
                value={pipeline.stages}
                onChange={(v) =>
                    setPipeline({ ...pipeline, stages: v })
                }
            />
            <div className="flex mb-4">
                <Button.Primary onClick={editPipeline}>Update pipeline</Button.Primary>
                <Button.Primary onClick={previewPipeline}>Preview pipeline</Button.Primary>
            </div>
            <h4 className="text-xl text-blueGray-800 font-bold mb-4">
                Pipeline preview
            </h4>
            <PipelinePreview
                value={pipelineResult}
            />
        </div>
    );
}
