import type { Dimensions } from "@/types";
import { getTrackMediaUrl, getTrackUrl } from "@/utils/track-utils";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useRef } from "react";

interface MediaPlayerArtworkProps extends Partial<Dimensions> {
    onEnded?: (event: React.SyntheticEvent<HTMLMediaElement>) => void;
    onPause?: (event: React.SyntheticEvent<HTMLMediaElement>) => void;
    onPlay?: (event: React.SyntheticEvent<HTMLMediaElement>) => void;
    onTimeUpdate?: (event: React.SyntheticEvent<HTMLMediaElement>) => void;
    trackId: string | undefined;
}

const WINDOW_MARGIN = 16;
const GAP = 8;
const TREE_WIDTH = 200;
const MIN_SIZE = 400;

const MediaPlayerMedia: React.FC<MediaPlayerArtworkProps> = (props) => {
    const { trackId, onPlay, onPause, onTimeUpdate, onEnded, width, height } =
        props;
    const style = useMemo(
        () => getSquareAspectRatioStyle({ height, width }),
        [height, width]
    );
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaUrl = getTrackMediaUrl(trackId);
    const isVideo = mediaUrl?.endsWith(".mp4") ?? false;

    useEffect(
        function forceInlinePlayer() {
            if (!isVideo || videoRef.current === null) {
                return;
            }

            // https://stackoverflow.com/a/63638423
            videoRef.current.setAttribute("webkit-playsinline", "");
            videoRef.current.setAttribute("playsinline", "");
        },
        [isVideo]
    );

    let content: React.ReactNode = null;

    if (isVideo) {
        content = (
            <video
                autoPlay={true}
                height={style.height}
                id={trackId}
                onEnded={onEnded}
                onPause={onPause}
                onPlay={onPlay}
                onTimeUpdate={onTimeUpdate}
                ref={videoRef}
                src={mediaUrl}
                width={style.width}
            />
        );
    }

    if (isEmpty(trackId) || isEmpty(mediaUrl)) {
        content = (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                }}
            />
        );
    }

    if (!isEmpty(trackId) && !isVideo) {
        const trackUrl = getTrackUrl(trackId!);

        content = (
            <>
                <img
                    alt="album artwork"
                    height={style.height}
                    src={mediaUrl}
                    width={style.width}
                />
                <audio
                    autoPlay={true}
                    id={trackId}
                    onEnded={onEnded}
                    onPause={onPause}
                    onPlay={onPlay}
                    onTimeUpdate={onTimeUpdate}
                    src={trackUrl}
                />
            </>
        );
    }

    return <div style={style}>{content}</div>;
};

const getSquareAspectRatioStyle = (dimensions: Partial<Dimensions>) => {
    const width =
        Math.max(dimensions.width ?? 0, MIN_SIZE) -
        TREE_WIDTH -
        GAP -
        WINDOW_MARGIN;
    const height = Math.max(dimensions.height ?? 0, MIN_SIZE) - 110;
    const size = Math.min(width, height);

    return { width: size, height: size };
};

export { MediaPlayerMedia };
