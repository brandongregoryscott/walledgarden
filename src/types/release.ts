import type { Track } from "@/types";

interface Release {
    id: string;
    name: string;
    releasedOn: string;
}

interface DenormalizedRelease extends Release {
    tracks: Track[];
}

export type { DenormalizedRelease, Release };
