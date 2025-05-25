import React, { useEffect, useState } from "react";

const Clock: React.FC = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const today = new Date();
            const hour = today.getHours();
            const minute = today.getMinutes();
            const meridiem = hour >= 12 ? "PM" : "AM";
            setTime(`${formatHour(hour)}:${formatMinute(minute)} ${meridiem}`);
        });

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 0,
                padding: 4,
                boxShadow:
                    "inset -1px -1px var(--button-face), inset 1px 1px grey",
            }}>
            {time}
        </div>
    );
};

const formatHour = (hour: number): string =>
    `${hour >= 12 ? Math.abs(hour - 12) : hour}`;

const formatMinute = (minute: number): string =>
    minute < 10 ? `0${minute}` : `${minute}`;

export { Clock };
