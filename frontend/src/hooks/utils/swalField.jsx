export const createSwalField = (inputId, label, value) => {
    return `
        <div class="input m-1 form-group">
            <label for="swal2-input${Number(inputId)}" class="label">${label}</label>  
            <input id="swal2-input${Number(inputId)}" placeholder="${label}" value="${value}"></input>
        </div>        
    `
}

const getToday = () => {
    try {
        return (new Date(Date.now())).toISOString().split("T")[0];
    } catch (error) {
        return "1970-01-01";
    }
}

export const createSwalDateField = (inputId, label, value) => {
    return `
    <label class="input m-1">
        <span class="label">${label}</span>
        <input type="date" id="swal2-input${Number(inputId)}" value="${value || getToday()}" />
    </label>
    `
}