import {
    Button,
    MediaPlayerReleaseItem,
    Window,
    MediaPlayerMedia,
} from "@/components";
import { RELEASES, TRACKS } from "@/constants/releases";
import { MEDIA_PLAYER } from "@/constants/windows";
import { useWindowState } from "@/hooks";
import { findById } from "@/utils/collection-utils";
import {
    pauseAllMediaElements,
    playTrackMediaElement,
    seekMediaElement,
    stopAllMediaElements,
} from "@/utils/dom-utils";
import { formatLength, getNextTrackId } from "@/utils/track-utils";
import React, { useMemo, useState } from "react";

const MediaPlayer: React.FC = () => {
    const { state } = useWindowState(MEDIA_PLAYER.id);
    const { width, height } = state ?? {};
    const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
    const [lastFocusedTrackId, setLastFocusedTrackId] = useState<
        string | undefined
    >(undefined);
    const [activeTrackId, setActiveTrackId] = useState<string | undefined>(
        undefined
    );

    const activeTrack = useMemo(
        () => findById(TRACKS, activeTrackId),
        [activeTrackId]
    );
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const handleSelect = (trackId: string) => {
        stopAllMediaElements();
        setActiveTrackId(trackId);
        playTrackMediaElement(trackId);
    };

    const handlePlayClick = () => {
        const trackId = activeTrackId ?? lastFocusedTrackId;
        if (trackId === undefined) {
            return;
        }
        setActiveTrackId(trackId);
        playTrackMediaElement(trackId);
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTime = parseInt(event.target.value);
        if (activeTrackId === undefined) {
            return;
        }

        seekMediaElement(activeTrackId, updatedTime);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleEnded = () => {
        const nextTrackId = getNextTrackId(activeTrackId);
        if (nextTrackId !== undefined) {
            setActiveTrackId(nextTrackId);
        }
    };

    const handleTimeUpdate = (
        event: React.SyntheticEvent<HTMLMediaElement>
    ) => {
        const timeInSeconds = (event.target as HTMLMediaElement).currentTime;
        setTimeInSeconds(timeInSeconds);
    };

    return (
        <Window id={MEDIA_PLAYER.id} title={MEDIA_PLAYER.title}>
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    width: "100%",
                    height: "100%",
                }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px 0px",
                        alignItems: "flex-start",
                        width: "100%",
                        height: "100%",
                    }}>
                    <MediaPlayerMedia
                        height={height}
                        onEnded={handleEnded}
                        onPause={handlePause}
                        onPlay={handlePlay}
                        onTimeUpdate={handleTimeUpdate}
                        trackId={activeTrackId}
                        width={width}
                    />
                    <div className="field-row" style={{ width: "100%" }}>
                        <label htmlFor="time" style={{ width: "24px" }}>
                            {formatLength(timeInSeconds)}
                        </label>
                        <input
                            id="time"
                            max={activeTrack?.length}
                            min={0}
                            onChange={handleSeek}
                            type="range"
                            value={timeInSeconds}
                        />
                        <label htmlFor="time" style={{ width: "24px" }}>
                            {activeTrack !== undefined
                                ? formatLength(activeTrack.length)
                                : "00:00"}
                        </label>
                    </div>
                    <div style={{ display: "flex" }}>
                        <Button
                            className="media-player-button"
                            data-active={
                                isPlaying && activeTrackId !== undefined
                            }
                            onClick={handlePlayClick}>
                            <svg
                                aria-label="play"
                                height="10"
                                viewBox="0 0 494.942 494.942"
                                width="10"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M35.353 0l424.236 247.471L35.353 494.942z" />
                            </svg>
                        </Button>
                        <Button
                            className="media-player-button"
                            data-active={
                                !isPlaying &&
                                activeTrackId !== undefined &&
                                timeInSeconds > 0
                            }
                            onClick={pauseAllMediaElements}>
                            <svg
                                aria-label="pause"
                                height="10"
                                viewBox="0 0 424.236 424.236"
                                width="10"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M256.471 2h176.765v424.236H256.471zM2 2h176.765v424.236H2z" />
                            </svg>
                        </Button>
                        <Button
                            className="media-player-button"
                            data-active={
                                !isPlaying &&
                                (activeTrackId === undefined ||
                                    timeInSeconds === 0)
                            }
                            onClick={stopAllMediaElements}>
                            <svg
                                aria-label="stop"
                                height="10"
                                width="10"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h306v306H0z" />
                            </svg>
                        </Button>
                    </div>
                </div>
                <ul
                    className="tree-view"
                    style={{
                        minWidth: 200,
                        userSelect: "none",
                    }}>
                    {RELEASES.map((release) => (
                        <MediaPlayerReleaseItem
                            activeTrackId={activeTrackId}
                            key={release.id}
                            onFocus={setLastFocusedTrackId}
                            onSelect={handleSelect}
                            release={release}
                        />
                    ))}
                </ul>
            </div>
        </Window>
    );
};

export { MediaPlayer };
