import { HomePage as HomePageContent } from "@/components/pages/home-page";
import { useEffect, useState } from "react";

const HomePage: React.FC = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return;
    }

    return <HomePageContent />;
};

// eslint-disable-next-line collation/no-default-export -- NextJS pages need to be default exported
export default HomePage;
