import {
    ADD_FILES,
    START_UPLOAD,
    UPDATE_PROGRESS,
    UPLOAD_SUCCESS,
    UPLOAD_FAILED,
    CANCEL_UPLOAD,
    RETRY_UPLOAD,
    REMOVE_FILE,
} from "./actions";

export const initialState = {
    files: [],
};

export const uploadReducer = (
    state,
    action
) => {

    switch (action.type) {

        // ===== ADD FILES =====

        case ADD_FILES:

            const newFiles =
                action.payload.map((item) => ({

                    id: crypto.randomUUID(),

                    // Original File
                    file: item.file,

                    // Base64 Preview
                    preview: item.preview,

                    name: item.file.name,
                    size: item.file.size,

                    progress: 0,
                    status: "idle",
                    error: null,

                }));

            return {
                ...state,
                files: [
                    ...state.files,
                    ...newFiles,
                ],
            };

        // ===== START UPLOAD =====

        case START_UPLOAD:

            return {
                ...state,
                files: state.files.map((file) =>

                    file.id === action.payload

                        ? {
                            ...file,
                            status: "uploading",
                        }

                        : file
                ),
            };

        // ===== UPDATE PROGRESS =====

        case UPDATE_PROGRESS:

            return {
                ...state,
                files: state.files.map((file) =>

                    file.id === action.payload.id

                        ? {
                            ...file,
                            progress:
                                action.payload.progress,
                        }

                        : file
                ),
            };

        // ===== SUCCESS =====

        case UPLOAD_SUCCESS:

            return {
                ...state,
                files: state.files.map((file) =>

                    file.id === action.payload

                        ? {
                            ...file,
                            progress: 100,
                            status: "success",
                        }

                        : file
                ),
            };

        // ===== FAILED =====

        case UPLOAD_FAILED:

            return {
                ...state,
                files: state.files.map((file) =>

                    file.id === action.payload.id

                        ? {
                            ...file,
                            status: "failed",
                            error:
                                action.payload.error,
                        }

                        : file
                ),
            };

        // ===== CANCEL =====

        case CANCEL_UPLOAD:

            return {
                ...state,
                files: state.files.map((file) =>

                    file.id === action.payload

                        ? {
                            ...file,
                            status: "cancelled",
                        }

                        : file
                ),
            };

        // ===== RETRY =====

        case RETRY_UPLOAD:

            return {
                ...state,
                files: state.files.map((file) =>

                    file.id === action.payload

                        ? {
                            ...file,
                            progress: 0,
                            status: "idle",
                            error: null,
                        }

                        : file
                ),
            };

        // ===== REMOVE =====

        case REMOVE_FILE:

            return {
                ...state,
                files: state.files.filter(

                    (file) =>
                        file.id !== action.payload

                ),
            };

        default:
            return state;
    }
};