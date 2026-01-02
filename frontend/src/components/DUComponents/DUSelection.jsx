export const DUSelection = ({options, defaultValue, onChange, className}) => {
    if (!Array.isArray(options)) {
        return (<div>lo hiciste mal po</div>);
    }

    return (
        <div>
            <select className={`select solicitud-filtro-select ${className}`} defaultValue={defaultValue} onChange={onChange}>
                <option disabled={true}>{defaultValue}</option>
                {options.map((option, index) => {
                    return (<option key={`${String(option)}-${index}`} value={String(option)}>{String(option)}</option>);
                })}
            </select>
        </div>
    );
}

