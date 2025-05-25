interface SelectProps {
    options: SelectOption[];
    value: string | undefined;
}

interface SelectOption {
    label: string;
    value: string;
}

const Select: React.FC<SelectProps> = (props) => {
    const { options, value } = props;
    return (
        <select>
            {options.map((option) => (
                <option
                    key={option.value}
                    selected={option.value === value}
                    value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export { Select };
