import { Button } from "@/components";
import Image from "next/image";

const StartButton: React.FC = () => {
    return (
        <Button className="task-bar">
            <Image
                alt="Windows logo"
                height={16}
                src="/windows.png"
                width={16}
            />
            <b>Start</b>
        </Button>
    );
};

export { StartButton };
