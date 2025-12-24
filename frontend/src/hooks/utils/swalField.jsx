export const createSwalField = (inputId, label, value) => {
    return (
        <div>
            <label for={`swal2-input${Number(inputId)}`}>{label}</label>  
            <input id={`swal2-input${Number(inputId)}`} class="swal2-input" placeholder={label} value={value}></input>
        </div>        
    )
}