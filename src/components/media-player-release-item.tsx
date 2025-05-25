import { MediaPlayerTrackItem } from "@/components/media-player-track-item";
import { useDoubleTap } from "@/hooks";
import type { DenormalizedRelease } from "@/types";
import { cn } from "@/utils/classnames";
import { formatDate } from "@/utils/date-utils";
import { first } from "lodash";

interface MediaPlayerReleaseItemProps {
    activeTrackId: string | undefined;
    onFocus: (trackId: string) => void;
    onSelect: (trackId: string) => void;
    release: DenormalizedRelease;
}

const MediaPlayerReleaseItem: React.FC<MediaPlayerReleaseItemProps> = (
    props
) => {
    const { release, activeTrackId, onSelect, onFocus } = props;
    const firstTrack = first(release.tracks);
    const isSingle = release.tracks.length === 1;
    const handleSelect = () => {
        if (!isSingle || firstTrack === undefined) {
            return;
        }

        onSelect(firstTrack.id);
    };

    const { handleClick } = useDoubleTap({ onDoubleTap: handleSelect });

    const handleFocus = () => {
        if (!isSingle || firstTrack === undefined) {
            return;
        }

        onFocus(firstTrack.id);
    };

    const handleSingleIndicatorClick = () => {
        if (!isSingle || firstTrack === undefined) {
            return;
        }

        const trackLabel = document.getElementById(
            getTrackLabelId(firstTrack?.id)
        );
        trackLabel?.focus();
    };

    const releaseContent = (
        <>
            {isSingle && (
                <div
                    className="single-indicator"
                    onClick={handleSingleIndicatorClick}
                />
            )}
            <span
                className={cn({
                    active: activeTrackId === firstTrack?.id,
                })}
                id={isSingle ? getTrackLabelId(firstTrack?.id) : undefined}
                onClick={handleClick}
                onDoubleClick={handleSelect}
                onFocus={handleFocus}
                tabIndex={0}>
                {release.name} ({formatDate(release.releasedOn)})
            </span>
        </>
    );

    return (
        <li
            className={cn("media-player-list-item", {
                active: activeTrackId === firstTrack?.id && isSingle,
            })}>
            {isSingle ? (
                releaseContent
            ) : (
                <details open={true}>
                    <summary>{releaseContent}</summary>
                    <ul>
                        {release.tracks.map((track) => (
                            <MediaPlayerTrackItem
                                active={track.id === activeTrackId}
                                key={track.id}
                                onFocus={onFocus}
                                onSelect={onSelect}
                                track={track}
                            />
                        ))}
                    </ul>
                </details>
            )}
        </li>
    );
};

const getTrackLabelId = (trackId: string | undefined): string =>
    `track-label-${trackId}`;

export { MediaPlayerReleaseItem };
