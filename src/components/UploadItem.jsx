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

  const [showPreview,
    setShowPreview] =
    useState(false);

  // ===== SAFE PREVIEW =====

  const previewUrl =
    file.preview || null;

  // ===== SAFE FILE SIZE =====

  const fileSize =
    file.size
      ? (file.size / 1024)
        .toFixed(2)
      : "0";

  return (
    <>

      {/* ===== CARD ===== */}

      <div className="upload-item">

        {/* ===== IMAGE PREVIEW ===== */}

        {previewUrl && (

          <img
            src={previewUrl}
            alt={file.name}

            className="preview-image"

            onClick={() => {
              setShowPreview(true);
            }}
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

        <div className="progress-container">

          <ProgressBar
            progress={
              file.progress
            }
          />

        </div>

        {/* ===== PROGRESS TEXT ===== */}

        <p className="progress-percentage">

          {file.progress}%

        </p>

        {/* ===== STATUS ===== */}

        <p
          className={`status ${file.status}`}
        >

          Status:
          {" "}
          {file.status}

        </p>

        {/* ===== ERROR ===== */}

        {file.error && (

          <p className="error-text">

            {file.error}

          </p>

        )}

        {/* ===== BUTTONS ===== */}

        <div className="buttons">

          {/* ===== CANCEL ===== */}

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

          {/* ===== RETRY ===== */}

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

          {/* ===== REMOVE ===== */}

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

      {/* ===== FULLSCREEN MODAL ===== */}

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

              // Prevent modal close
              onClick={(e) =>
                e.stopPropagation()
              }
            />

          </div>

        )}

    </>
  );
}

export default UploadItem;