import { store, useStore } from "@/store";
import { useEffect } from "react";

const MinimizeAnimator: React.FC = () => {
    const animation = useStore((s) => s.minimizeAnimation);

    useEffect(() => {
        if (!animation) return;

        // Clone the window's title bar. The real Win98 animation shows only
        // the title bar itself (in active/blue state) — no window frame, no
        // silver body, no border. Just the title bar shrinking into the taskbar.
        const windowEl = document.getElementById(animation.windowId);
        const titleBar =
            windowEl?.querySelector<HTMLElement>(".title-bar");
        const titleBarClone = titleBar?.cloneNode(true) as
            | HTMLElement
            | undefined;

        // Force active (blue) state regardless of the original window's state.
        // Win98 always animates with the active title bar.
        if (titleBarClone) {
            titleBarClone.classList.remove("inactive");

            // Remove the control buttons — the real Win98 animation does not
            // show them, just the title bar gradient and text.
            titleBarClone
                .querySelector(".title-bar-controls")
                ?.remove();

            // Prevent text wrapping when the container narrows, and lock the
            // height so it doesn't grow from wrapped content.
            titleBarClone.style.whiteSpace = "nowrap";
            titleBarClone.style.overflow = "hidden";
            titleBarClone.style.flexShrink = "0";
        }

        // Invisible wrapper — exists only to clip the title bar via overflow:hidden
        // as it shrinks. No border, no background.
        const el = document.createElement("div");
        el.style.cssText = `
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            overflow: hidden;
            left: ${animation.fromRect.x}px;
            top: ${animation.fromRect.y}px;
            width: ${animation.fromRect.width}px;
            height: ${animation.fromRect.height}px;
        `;

        if (titleBarClone) {
            el.appendChild(titleBarClone);
        }

        document.body.appendChild(el);

        const keyframes: Keyframe[] = [
            {
                left: `${animation.fromRect.x}px`,
                top: `${animation.fromRect.y}px`,
                width: `${animation.fromRect.width}px`,
                height: `${animation.fromRect.height}px`,
            },
            {
                left: `${animation.toRect.x}px`,
                top: `${animation.toRect.y}px`,
                width: `${animation.toRect.width}px`,
                height: `${animation.toRect.height}px`,
            },
        ];

        const anim = el.animate(keyframes, {
            duration: 300,
            easing: "steps(5, end)",
            fill: "forwards",
        });

        anim.onfinish = () => {
            el.remove();
            store.getState().setMinimizeAnimation(null);
            if (animation.direction === "restore") {
                store.getState().setMinimized(animation.windowId, false);
            }
        };

        return () => {
            anim.cancel();
            el.remove();
        };
    }, [animation]);

    return null;
};

export { MinimizeAnimator };
