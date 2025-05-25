import {
    FORCED_CREATIVITY_TRACK,
    RELEASES,
    TRACKS,
} from "@/constants/releases";
import { findById } from "@/utils/collection-utils";
import { first } from "lodash";

const getTrackUrl = (trackId: string): string | undefined => {
    if (trackId === undefined) {
        return undefined;
    }

    const track = findById(TRACKS, trackId);
    if (track === undefined) {
        return undefined;
    }

    const release = findById(RELEASES, track.releaseId);
    if (release === undefined) {
        return undefined;
    }

    return `/releases/${release.id}/${track.id}.mp3`;
};

const getTrackMediaUrl = (trackId: string | undefined): string | undefined => {
    if (trackId === undefined) {
        return undefined;
    }

    const track = findById(TRACKS, trackId);
    if (track === undefined) {
        return undefined;
    }

    const release = findById(RELEASES, track.releaseId);
    if (release === undefined) {
        return undefined;
    }

    if (trackId === FORCED_CREATIVITY_TRACK.id) {
        return `/releases/${release.id}/${track.id}.mp4`;
    }

    return `/releases/${release.id}/cover.png`;
};

interface ToSecondsOptions {
    minutes: number;
    seconds: number;
}

const toSeconds = (options: ToSecondsOptions): number =>
    options.minutes * 60 + options.seconds;

const formatLength = (length: number): string => {
    const minutes = Math.floor(length / 60);
    const seconds = Math.floor(length % 60);

    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const getNextTrackId = (trackId: string | undefined): string | undefined => {
    const tracks = RELEASES.flatMap((release) => release.tracks);
    if (trackId === undefined) {
        return first(tracks)?.id;
    }

    const index = tracks.findIndex((track) => track.id === trackId);
    if (index < 0) {
        return undefined;
    }

    return tracks[index + 1]?.id;
};

export {
    formatLength,
    getNextTrackId,
    getTrackMediaUrl,
    getTrackUrl,
    toSeconds,
};
