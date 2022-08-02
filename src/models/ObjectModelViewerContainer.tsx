import { useCallback, useEffect, useState } from "react";
import { InsuranceApi } from "../api/InsuranceApi";
import { ImageInfo } from "./ImageInfo";
import ObjectModelViewer from "./ObjectModelViewer";


const ObjectModelViewerContainer = () => {
    const [image, setImage] = useState<ImageInfo | undefined>(undefined);

    const updateApiResponses = useCallback((category: string) => {
        if (!image) {
            console.error(`Image not set!'`);
            return;
        }

        console.log(`Classification received for ${image.file.name}: ${category}`);

        image.status = "complete";
        image.category = category;
        image.endTime = new Date().getTime();

        setImage(image);
    }, [image]);

    const onFilesChangedHandler = (files: File[]) => {
        setImage({
            file: files[0],
            startTime: new Date().getTime(),
            category: undefined,
            endTime: undefined,
            status: "idle",

        });
    };

    useEffect(() => {
        if (image && !image.endTime) {
            InsuranceApi.carModel(image.file).then((category) =>
                updateApiResponses(category)
            );
        }
    }, [image, setImage, updateApiResponses]);

    return (
        <>
            <h1>Object Model</h1>
            <ObjectModelViewer
                onFilesChangedHandler={onFilesChangedHandler}
                image={image}
            />
        </>
    );
};

export default ObjectModelViewerContainer;
