import { ADD_FILES }
    from "../reducer/actions";

function FileUpload({
    dispatch,
}) {

    // ===== COMPRESS IMAGE =====

    const compressImage =
        (file) => {

            return new Promise(
                (resolve) => {

                    // Non-image files
                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        resolve({
                            file,
                            preview: null,
                        });

                        return;
                    }

                    const reader =
                        new FileReader();

                    reader.onload =
                        (event) => {

                            const img =
                                new Image();

                            img.onload =
                                () => {

                                    const canvas =
                                        document.createElement(
                                            "canvas"
                                        );

                                    const ctx =
                                        canvas.getContext(
                                            "2d"
                                        );

                                    // Compress Size
                                    const maxWidth =
                                        300;

                                    const scale =
                                        maxWidth /
                                        img.width;

                                    canvas.width =
                                        maxWidth;

                                    canvas.height =
                                        img.height *
                                        scale;

                                    ctx.drawImage(
                                        img,
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                    );

                                    // Compressed Base64
                                    const compressed =
                                        canvas.toDataURL(
                                            "image/jpeg",
                                            0.5
                                        );

                                    resolve({
                                        file,
                                        preview:
                                            compressed,
                                    });

                                };

                            img.src =
                                event.target.result;

                        };

                    reader.readAsDataURL(
                        file
                    );

                }
            );

        };

    // ===== HANDLE FILES =====

    const handleFiles =
        async (e) => {

            const selectedFiles =
                Array.from(
                    e.target.files
                );

            if (
                selectedFiles.length === 0
            ) {
                return;
            }

            // Compress all images
            const filesWithPreview =
                await Promise.all(

                    selectedFiles.map(
                        compressImage
                    )

                );

            dispatch({
                type: ADD_FILES,
                payload:
                    filesWithPreview,
            });

        };

    return (
        <div className="file-upload">

            <input
                type="file"
                multiple
                onChange={handleFiles}
            />

        </div>
    );
}

export default FileUpload;