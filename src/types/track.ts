interface Track {
    id: string;
    /**
     * Length of the track in seconds
     */
    length: number;
    name: string;
    releaseId: string;
}

export type { Track };
