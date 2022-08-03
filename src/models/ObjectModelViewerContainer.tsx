import { useCallback, useEffect, useState } from "react";
import { InsuranceApi } from "../api/InsuranceApi";
import { ImageInfo } from "./ImageInfo";
import ObjectModelViewer from "./ObjectModelViewer";


const ObjectModelViewerContainer = () => {
    const [imageInfo, setImage] = useState<ImageInfo | undefined>(undefined);
    const [processedImage, setProcessedImage] = useState<string | undefined>(undefined);

    const updateApiResponses = useCallback((category: string) => {
        if (!imageInfo) {
            console.error(`Image not set!'`);
            return;
        }

        console.log(`Classification received for ${imageInfo.file.name}: ${category}`);

        imageInfo.status = "complete";
        imageInfo.category = category;
        imageInfo.endTime = new Date().getTime();

        setImage(imageInfo);
    }, [imageInfo]);

    const onFilesChangedHandler = (files: File[]) => {
        setProcessedImage(undefined);
        setImage({
            file: files[0],
            startTime: new Date().getTime(),
            category: undefined,
            endTime: undefined,
            status: "idle",

        });
    };

    useEffect(() => {
        if (imageInfo && !imageInfo.endTime) {
            InsuranceApi.objectModel(imageInfo.file).then(img => {
                imageInfo.endTime = new Date().getTime();
                imageInfo.category = undefined;
                setProcessedImage(img);
            });
        }
    }, [imageInfo]);

    return (
        <>
            <h1>Object Model</h1>
            <ObjectModelViewer
                onFilesChangedHandler={onFilesChangedHandler}
                imageInfo={imageInfo}
                processedImage={processedImage}
            />
        </>
    );
};

export default ObjectModelViewerContainer;
