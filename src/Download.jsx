import { memo } from "react";
import { FaDownload } from "react-icons/fa";

const Download = () => {
    return (
        <button>
            <FaDownload/>
        </button>
    );
};

export default memo(Download);