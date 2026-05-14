import {
  useEffect,
  useReducer,
  useRef,
} from "react";

import "./App.css";

import FileUpload from "./components/FileUpload";
import UploadList from "./components/UploadList";

import {
  uploadReducer,
} from "./reducer/uploadReducer";

import {
  START_UPLOAD,
  UPDATE_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILED,
} from "./reducer/actions";

// ===== LOAD SAVED FILES =====

const savedFiles =
  JSON.parse(
    localStorage.getItem("uploads")
  ) || [];

function App() {

  // ===== USEREDUCER =====

  const [state, dispatch] =
    useReducer(
      uploadReducer,
      {
        files: savedFiles,
      }
    );

  // ===== STORE INTERVALS =====

  const uploadIntervals =
    useRef({});

  // ===== START UPLOAD =====

  const startUpload = (file) => {

    // Prevent duplicate upload
    if (
      uploadIntervals.current[file.id]
    ) {
      return;
    }

    dispatch({
      type: START_UPLOAD,
      payload: file.id,
    });

    let progress =
      file.progress || 0;

    const interval =
      setInterval(() => {

        // Random Fail Chance
        const failChance =
          Math.random();

        if (failChance < 0.02) {

          clearInterval(interval);

          delete
            uploadIntervals.current[
            file.id
            ];

          dispatch({
            type: UPLOAD_FAILED,
            payload: {
              id: file.id,
              error:
                "Upload Failed",
            },
          });

          return;
        }

        // ===== UPDATE PROGRESS =====

        progress += Math.floor(
          Math.random() * 15
        );

        // ===== COMPLETE =====

        if (progress >= 100) {

          progress = 100;

          clearInterval(interval);

          delete
            uploadIntervals.current[
            file.id
            ];

          dispatch({
            type:
              UPDATE_PROGRESS,
            payload: {
              id: file.id,
              progress,
            },
          });

          dispatch({
            type:
              UPLOAD_SUCCESS,
            payload: file.id,
          });

        } else {

          dispatch({
            type:
              UPDATE_PROGRESS,
            payload: {
              id: file.id,
              progress,
            },
          });

        }

      }, 500);

    // Save Interval
    uploadIntervals.current[
      file.id
    ] = interval;
  };

  // ===== AUTO START =====

  useEffect(() => {

    state.files.forEach((file) => {

      if (
        file.status === "idle"
      ) {

        startUpload(file);

      }

    });

  }, [state.files]);

  // ===== HANDLE CANCEL =====

  useEffect(() => {

    state.files.forEach((file) => {

      if (
        file.status ===
        "cancelled"
      ) {

        const interval =
          uploadIntervals.current[
          file.id
          ];

        if (interval) {

          clearInterval(interval);

          delete
            uploadIntervals.current[
            file.id
            ];

        }

      }

    });

  }, [state.files]);

  // ===== SAVE TO LOCAL STORAGE =====

  useEffect(() => {

    try {

      const filesToSave =
        state.files.map((file) => ({

          id: file.id,

          name: file.name,
          size: file.size,

          progress:
            file.progress,

          status: file.status,

          error: file.error,

          // Save preview
          preview:
            file.preview || null,

        }));

      localStorage.setItem(
        "uploads",
        JSON.stringify(
          filesToSave
        )
      );

    } catch (error) {

      console.error(
        "LocalStorage Error:",
        error
      );

    }

  }, [state.files]);

  // ===== CLEANUP =====

  useEffect(() => {

    const intervals =
      uploadIntervals.current;

    return () => {

      Object.values(intervals)
        .forEach(clearInterval);

    };

  }, []);

  return (
    <div className="app">

      <h1>
        File Upload Manager
      </h1>

      <FileUpload
        dispatch={dispatch}
      />

      <UploadList
        files={state.files}
        dispatch={dispatch}
      />

    </div>
  );
}

export default App;