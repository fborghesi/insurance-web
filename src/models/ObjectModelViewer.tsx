import { Box } from "@mui/material";
import ImageUpload from "../components/ImageUpload";
import ImageClassificationCard from "./ImageClassificationCard";
import { ImageInfo } from "./ImageInfo";

type OnFilesChangedHandler = (files: File[]) => void;

type CarModelViewerProps = {
    onFilesChangedHandler: OnFilesChangedHandler;
    image: ImageInfo | undefined;
};

const ObjectModelViewer = (props: CarModelViewerProps) => {
    const { image } = props;
    const filesChangedHandler = (files: File[]) => {
        if (props.onFilesChangedHandler) {
            props.onFilesChangedHandler(files);
        }
    };

    return (
        <Box
            display="flex"
            flexWrap={"wrap"}
            justifyContent={"center"}
            padding={"10px"}
        >
            <ImageUpload
                multiple={false}
                onFilesChanged={filesChangedHandler}
            ></ImageUpload>
            <Box style={{ flexBasis: "100%", height: "30px" }}></Box>

            {image && (
                <ImageClassificationCard
                    key={image!.file.name}
                    file={image!.file}
                    category={image!.category}
                    timeMs={
                        image!.endTime
                            ? image!.endTime - image!.startTime
                            : undefined
                    }
                />
            )}
        </Box>
    );
};

export default ObjectModelViewer;
