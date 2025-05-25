const getAllMediaElements = (): HTMLMediaElement[] =>
    Array.from(document.querySelectorAll("audio")).concat(
        Array.from(document.querySelectorAll("video"))
    );

const getMediaElementById = (trackId: string): HTMLMediaElement | null =>
    document.getElementById(trackId) as HTMLMediaElement | null;

const playTrackMediaElement = (trackId: string): void => {
    const mediaElement = document.getElementById(
        trackId
    ) as HTMLMediaElement | null;
    if (mediaElement === null) {
        return;
    }

    mediaElement.play();
};

const seekMediaElement = (trackId: string, timeInSeconds: number): void => {
    const mediaElement = document.getElementById(
        trackId
    ) as HTMLMediaElement | null;
    if (mediaElement === null) {
        return;
    }

    mediaElement.currentTime = timeInSeconds;
};

const stopMediaElement = (audioElement: HTMLMediaElement): void => {
    audioElement.pause();
    audioElement.currentTime = 0;
};

const stopAllMediaElements = (): void => {
    const mediaElements = getAllMediaElements();
    mediaElements.forEach(stopMediaElement);
};

const pauseMediaElement = (mediaElement: HTMLMediaElement): void => {
    mediaElement.pause();
};

const pauseAllMediaElements = (): void => {
    const mediaElements = getAllMediaElements();
    mediaElements.forEach(pauseMediaElement);
};

export {
    getMediaElementById,
    pauseAllMediaElements,
    playTrackMediaElement,
    seekMediaElement,
    stopAllMediaElements,
};
