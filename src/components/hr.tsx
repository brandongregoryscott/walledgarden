import { cn } from "@/utils/classnames";

interface HrProps {
    vertical?: boolean;
}

const Hr: React.FC<HrProps> = (props) => {
    const { vertical } = props;
    return <hr className={cn({ vertical })} />;
};

export { Hr };
