/* eslint-disable @next/next/no-img-element */
import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box, display } from "@mui/system";
import { useEffect, useState } from "react";
import { loadImage } from "../utils/loadImage";
import { useAsync } from "../utils/useAsync";

export type ImageClassificationCardProps = {
    file: File;
    category: string | undefined;
    timeMs: number | undefined;
};

const formatTimeMs = (timeMs: number): string => {
    return timeMs ? (Math.round(timeMs / 10) / 100).toFixed(2) : "";
};

const ImageClassificationCard = (props: ImageClassificationCardProps) => {
    const { execute, status, value: image, error } = useAsync(loadImage);

    useEffect(() => {
        execute(props.file);
    }, [execute, props.file]);

    if (status !== "success") {
        return <CircularProgress />;
    }

    const timeInfo = props.timeMs ? (
        <Typography variant="body2" color="text.secondary">
            Processing time: {formatTimeMs(props.timeMs)} secs.
        </Typography>
    ) : (
        <></>
    );

    const categoryInfo = props.category ? (
        <Typography variant="body1" color="text.primary">
            Classification Category:{" "}
            <Box sx={{ fontWeight: "bold" }} display="inline">
                {props.category.toUpperCase()}
            </Box>
        </Typography>
    ) : (
        <CircularProgress />
    );

    return (
        <Paper
            elevation={3}
            // variant="outlined"
            square
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "400px",
            }}
        >
            <Typography gutterBottom variant="h5" component="div">
                {props.file.name}
            </Typography>

            <img
                src={image as string}
                alt={props.file.name}
                height="150px"
                style={{ display: "block" }}
            />

            <Box display="flex" flexDirection={"column"} alignItems="left">
                <Typography variant="body2" color="text.secondary">
                    File Size: {props.file.size.toLocaleString()} bytes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    File Type: {props.file.type}
                </Typography>
                {timeInfo}
                {categoryInfo}
            </Box>
        </Paper>
    );
};

export default ImageClassificationCard;
