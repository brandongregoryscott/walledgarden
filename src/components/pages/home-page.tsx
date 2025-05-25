import {
    TaskBar,
    TaskBarButton,
    StartButton,
    Hr,
    Shortcut,
} from "@/components";
import { MediaPlayer } from "@/components/media-player";
import { MEDIA_PLAYER } from "@/constants/windows";
import { useDesktopState, useWindowState } from "@/hooks";
import { useCallback, useRef } from "react";

const HomePage: React.FC = () => {
    const { clearActiveWindow, windows } = useDesktopState();
    const { open: openMediaPlayer } = useWindowState(MEDIA_PLAYER.id);
    const divRef = useRef<HTMLDivElement | null>(null);
    const handleClick = useCallback(
        function handleClick(event: React.MouseEvent) {
            const { target } = event;
            const div = divRef.current;
            if (target !== div) {
                return;
            }

            clearActiveWindow();
        },
        [clearActiveWindow]
    );

    return (
        <div
            onClick={handleClick}
            ref={divRef}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}>
            <Shortcut
                iconName="Mplayer10"
                label="Windows Media Player"
                onOpen={openMediaPlayer}
            />
            {MEDIA_PLAYER.id in windows && <MediaPlayer />}
            <TaskBar>
                <StartButton />
                <Hr vertical={true} />
                {Object.keys(windows).map((id) => (
                    <TaskBarButton id={id} key={id} />
                ))}
            </TaskBar>
        </div>
    );
};

export { HomePage };
