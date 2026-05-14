import UploadItem from "./UploadItem";

function UploadList({ files, dispatch }) {

    return (
        <div className="upload-list">

            {files.map((file) => (

                <UploadItem
                    key={file.id}
                    file={file}
                    dispatch={dispatch}
                />

            ))}

        </div>
    );
}

export default UploadList;