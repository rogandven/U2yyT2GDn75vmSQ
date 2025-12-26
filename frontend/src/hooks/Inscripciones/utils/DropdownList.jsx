export const DropdownList = (className, data, label, id) => {
    return (
        <select className={`select ${className}`} id={id}>
            <option disabled selected>{label}</option>
            {Array.isArray(data) && data.map((name) => {
                return (
                    <option>{String(name)}</option>
                );
            })}
        </select>   
    );
}