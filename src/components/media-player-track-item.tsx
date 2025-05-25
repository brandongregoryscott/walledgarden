import { useDoubleTap } from "@/hooks";
import type { Track } from "@/types";
import { cn } from "@/utils/classnames";
import React from "react";

interface MediaPlayerTrackItemProps {
    active: boolean;
    onFocus: (trackId: string) => void;
    onSelect: (trackId: string) => void;
    track: Track;
}

const MediaPlayerTrackItem: React.FC<MediaPlayerTrackItemProps> = (props) => {
    const { track, active, onFocus, onSelect } = props;
    const { handleClick } = useDoubleTap({
        onDoubleTap: () => onSelect(track.id),
    });
    return (
        <li
            className={cn("media-player-list-item", { active })}
            onClick={handleClick}
            onDoubleClick={() => onSelect(track.id)}
            onFocus={() => onFocus(track.id)}
            tabIndex={0}>
            <span>{track.name}</span>
        </li>
    );
};

export { MediaPlayerTrackItem };
