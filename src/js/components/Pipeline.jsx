import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

export default function Pipeline({ value, onChange}) {
    return (
        <div className="border border-gray-100 p-2 rounded">
            <AceEditor
                mode="json"
                theme="github"
                width="100%"
                height="150px"
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
