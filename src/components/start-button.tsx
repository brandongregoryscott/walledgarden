import { Button } from "@/components";

const StartButton: React.FC = () => {
    return (
        <Button className="task-bar">
            <img alt="Windows logo" height={16} src="/windows.png" width={16} />
            <b>Start</b>
        </Button>
    );
};

export { StartButton };
