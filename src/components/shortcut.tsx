import { useDoubleTap } from "@/hooks";
import { Mplayer10 } from "@react95/icons";
import React, { useCallback } from "react";

interface ShortcutProps {
    iconName: "Mplayer10";
    label: string;
    onOpen: () => void;
}

const Shortcut: React.FC<ShortcutProps> = (props) => {
    const { label, iconName, onOpen } = props;

    const { handleClick } = useDoubleTap({ onDoubleTap: onOpen });
    const handleKeyDown = useCallback(
        function handleKeyDown(event: React.KeyboardEvent) {
            if (event.key === "Enter") {
                onOpen();
            }
        },
        [onOpen]
    );

    return (
        <div
            className="shortcut"
            onClick={handleClick}
            onDoubleClick={onOpen}
            onKeyDown={handleKeyDown}
            tabIndex={0}>
            {getIcon(iconName)}
            <label className="shortcut-label">{label}</label>
        </div>
    );
};

const getIcon = (name: string): React.ReactNode => {
    switch (name) {
        case "Mplayer10":
            return <Mplayer10 variant="32x32_4" />;
    }
};

export { Shortcut };
