import { useState } from "react";

import ProgressBar from "./ProgressBar";

import {
    CANCEL_UPLOAD,
    RETRY_UPLOAD,
    REMOVE_FILE,
} from "../reducer/actions";

function UploadItem({
    file,
    dispatch,
}) {

    const [showPreview, setShowPreview] =
        useState(false);

    // Safe Preview
    const previewUrl =
        file.preview || null;

    // Safe File Size
    const fileSize =
        file.size
            ? (file.size / 1024).toFixed(2)
            : "0";

    return (
        <>
            <div className="upload-item">

                {/* ===== IMAGE PREVIEW ===== */}

                {previewUrl && (

                    <img
                        src={previewUrl}
                        alt={file.name}
                        className="preview-image"
                        onClick={() =>
                            setShowPreview(true)
                        }
                    />

                )}

                {/* ===== FILE NAME ===== */}

                <h3 className="file-name">
                    {file.name}
                </h3>

                {/* ===== FILE SIZE ===== */}

                <p className="file-size">
                    {fileSize} KB
                </p>

                {/* ===== PROGRESS BAR ===== */}

                <ProgressBar
                    progress={file.progress}
                />

                {/* ===== PROGRESS TEXT ===== */}

                <p className="progress-percentage">
                    {file.progress}%
                </p>

                {/* ===== STATUS ===== */}

                <p
                    className={`status ${file.status}`}
                >
                    Status: {file.status}
                </p>

                {/* ===== ERROR MESSAGE ===== */}

                {file.error && (

                    <p className="error-text">
                        {file.error}
                    </p>

                )}

                {/* ===== BUTTONS ===== */}

                <div className="buttons">

                    {/* CANCEL */}

                    {file.status ===
                        "uploading" && (

                            <button
                                onClick={() =>
                                    dispatch({
                                        type:
                                            CANCEL_UPLOAD,
                                        payload:
                                            file.id,
                                    })
                                }
                            >
                                Cancel
                            </button>

                        )}

                    {/* RETRY */}

                    {(file.status ===
                        "failed" ||

                        file.status ===
                        "cancelled") && (

                            <button
                                onClick={() =>
                                    dispatch({
                                        type:
                                            RETRY_UPLOAD,
                                        payload:
                                            file.id,
                                    })
                                }
                            >
                                Retry
                            </button>

                        )}

                    {/* REMOVE */}

                    <button
                        onClick={() =>
                            dispatch({
                                type:
                                    REMOVE_FILE,
                                payload:
                                    file.id,
                            })
                        }
                    >
                        Remove
                    </button>

                </div>
            </div>

            {/* ===== FULLSCREEN PREVIEW ===== */}

            {showPreview &&
                previewUrl && (

                    <div
                        className="image-modal"
                        onClick={() =>
                            setShowPreview(false)
                        }
                    >

                        <img
                            src={previewUrl}
                            alt={file.name}
                            className="fullscreen-image"
                        />

                    </div>

                )}
        </>
    );
}

export default UploadItem;