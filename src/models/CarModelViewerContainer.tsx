import createTypography from "@mui/material/styles/createTypography";
import { useCallback, useEffect, useState } from "react";
import { InsuranceApi } from "../api/InsuranceApi";
import { loadImage } from "../utils/loadImage";
import { ImageInfo } from "./ImageInfo";
import CarModelViewer from "./CarModelViewer";

const CarModelViewerContainer = () => {
    const [imageMap, setImageMap] = useState<Map<File, ImageInfo>>(new Map());

    const updateApiResponses = useCallback((file: File, category: string) => {
        console.log(`Classification received for ${file.name}: ${category}`);

        if (!imageMap.has(file)) {
            console.error(`Map entry for file '${file} not found!'`);
            return;
        }

        const newImageMap = new Map<File, ImageInfo>(imageMap);

        const carImage = newImageMap.get(file);
        carImage!.status = "complete";
        carImage!.category = category;
        carImage!.endTime = new Date().getTime();

        setImageMap(newImageMap);
    }, [imageMap]);

    const onFilesChangedHandler = (files: File[]) => {
        const newImageMap = new Map<File, ImageInfo>(
            files.map((file) => {
                return [
                    file,
                    {
                        file,
                        startTime: new Date().getTime(),
                        category: undefined,
                        endTime: undefined,
                        status: "idle",
                    },
                ];
            })
        );
        setImageMap(newImageMap);
    };

    useEffect(() => {
        imageMap.forEach((value, key) => {
            if (!value.endTime) {
                InsuranceApi.carModel(key).then((category) =>
                    updateApiResponses(key, category)
                );
            }
        });
    }, [imageMap, setImageMap, updateApiResponses]);

    return (
        <>
            <h1>Car Model</h1>
            <CarModelViewer
                onFilesChangedHandler={onFilesChangedHandler}
                images={imageMap}
            />
        </>
    );
};

export default CarModelViewerContainer;
