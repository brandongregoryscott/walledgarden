const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
    });
};

export { formatDate };
