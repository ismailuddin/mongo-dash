import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

export default function PipelineStages({ value, onChange}) {
    return (
        <div className="border border-blueGray-300 p-2 rounded-md shadow-sm">
            <AceEditor
                mode="json"
                theme="github"
                width="100%"
                height="300px"
                value={value}
                onChange={onChange}
                fontSize={14}
                showGutter={false}
                showPrintMargin={false}
                name="Pipeline"
                editorProps={{$blockScrolling: true}}
                setOptions={{ useWorker: false }}
            />
        </div>
    );
}
