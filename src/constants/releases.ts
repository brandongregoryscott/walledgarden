import type { DenormalizedRelease, Release, Track } from "@/types";
import { toSeconds } from "@/utils/track-utils";
import { sortBy } from "lodash";

const THE_NEWS: Release = {
    id: "the-news",
    name: "The News",
    releasedOn: "2022-09-09T12:00:00.000Z",
};

const THE_NEWS_TRACKS: Track[] = [
    {
        id: `${THE_NEWS.id}-the-news-at-5`,
        name: "The News at 5",
        releaseId: THE_NEWS.id,
        length: toSeconds({ minutes: 0, seconds: 52 }),
    },
    {
        id: `${THE_NEWS.id}-the-news-at-6`,
        name: "The News at 6",
        releaseId: THE_NEWS.id,
        length: toSeconds({ minutes: 1, seconds: 30 }),
    },
];

const SWING_COVER: Release = {
    id: "swing-cover-2",
    name: "Swing (cover²)",
    releasedOn: "2019-08-10T12:00:00.000Z",
};

const SWING_COVER_TRACK: Track = {
    id: `${SWING_COVER.id}-${SWING_COVER.id}`,
    name: SWING_COVER.name,
    length: toSeconds({ minutes: 3, seconds: 48 }),
    releaseId: SWING_COVER.id,
};

const WASTED_SUNSETS: Release = {
    id: "wasted-sunsets-without-you",
    name: "wasted sunsets without you",
    releasedOn: "2019-02-01T12:00:00.000Z",
};

const WASTED_SUNSETS_TRACK: Track = {
    id: `${WASTED_SUNSETS.id}-${WASTED_SUNSETS.id}`,
    name: WASTED_SUNSETS.name,
    length: toSeconds({ minutes: 7, seconds: 48 }),
    releaseId: WASTED_SUNSETS.id,
};

const FORCED_CREATIVITY: Release = {
    id: "forced-creativity",
    name: "forced creativity",
    releasedOn: "2018-01-19T12:00:00.000Z",
};

const FORCED_CREATIVITY_TRACK: Track = {
    id: `${FORCED_CREATIVITY.id}-${FORCED_CREATIVITY.id}`,
    name: `${FORCED_CREATIVITY.name}`,
    length: toSeconds({ minutes: 4, seconds: 38 }),
    releaseId: FORCED_CREATIVITY.id,
};

const FORCED_CREATIVITY_TRACKS: Track[] = [
    FORCED_CREATIVITY_TRACK,
    {
        id: `${FORCED_CREATIVITY.id}-to-be-continued`,
        name: "to be continued...",
        length: toSeconds({ minutes: 2, seconds: 21 }),
        releaseId: FORCED_CREATIVITY.id,
    },
    {
        id: `${FORCED_CREATIVITY.id}-the-shadows-are-fast-following`,
        name: "the shadows are fast following",
        length: toSeconds({ minutes: 7, seconds: 12 }),
        releaseId: FORCED_CREATIVITY.id,
    },
];

const HOME: Release = {
    id: "home",
    name: "Home",
    releasedOn: "2018-11-27T12:00:00.000Z",
};

const HOME_TRACKS: Track[] = [
    {
        id: `${HOME.id}-demo`,
        name: "demo",
        length: toSeconds({ minutes: 1, seconds: 23 }),
        releaseId: HOME.id,
    },
    {
        id: `${HOME.id}-sam-ray-beat`,
        name: "sam ray beat",
        length: toSeconds({ minutes: 1, seconds: 46 }),
        releaseId: HOME.id,
    },
    {
        id: `${HOME.id}-fighting-ganon`,
        name: "fighting (ganon)",
        length: toSeconds({ minutes: 1, seconds: 23 }),
        releaseId: HOME.id,
    },
    {
        id: `${HOME.id}-songs-about-death`,
        name: "songsaboutdeath",
        length: toSeconds({ minutes: 1, seconds: 30 }),
        releaseId: HOME.id,
    },
];

const ASSOCIATIONS: Release = {
    id: "associations",
    name: "Associations",
    releasedOn: "2017-08-19T12:00:00.000Z",
};

const ASSOCIATIONS_TRACKS: Track[] = [
    {
        name: "Uneasy / Breathing",
        id: `${ASSOCIATIONS.id}-uneasy-breathing`,
        length: toSeconds({ minutes: 3, seconds: 56 }),
        releaseId: ASSOCIATIONS.id,
    },
    {
        name: "Error: Message Not Sent",
        id: `${ASSOCIATIONS.id}-error-message-not-sent`,
        length: toSeconds({ minutes: 1, seconds: 16 }),
        releaseId: ASSOCIATIONS.id,
    },
    {
        name: "Hotline Bling",
        id: `${ASSOCIATIONS.id}-hotline-bling`,
        length: toSeconds({ minutes: 2, seconds: 6 }),
        releaseId: ASSOCIATIONS.id,
    },
    {
        name: "Breathing / Accepting",
        id: `${ASSOCIATIONS.id}-breathing-accepting`,
        length: toSeconds({ minutes: 3, seconds: 42 }),
        releaseId: ASSOCIATIONS.id,
    },
];

const TRACKS = [
    ...THE_NEWS_TRACKS,
    SWING_COVER_TRACK,
    WASTED_SUNSETS_TRACK,
    ...FORCED_CREATIVITY_TRACKS,
    ...HOME_TRACKS,
    ...ASSOCIATIONS_TRACKS,
];

const RELEASES = sortBy(
    [
        THE_NEWS,
        SWING_COVER,
        WASTED_SUNSETS,
        FORCED_CREATIVITY,
        HOME,
        ASSOCIATIONS,
    ].map(
        (release): DenormalizedRelease => ({
            ...release,
            tracks: TRACKS.filter((track) => track.releaseId === release.id),
        })
    ),
    (release) => release.releasedOn
).reverse();

export { FORCED_CREATIVITY_TRACK, RELEASES, TRACKS };
