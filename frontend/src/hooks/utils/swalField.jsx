export const createSwalField = (inputId, label, value) => {
    return `
        <div class="input m-1 form-group">
            <label for="swal2-input${Number(inputId)}" class="label">${label}</label>  
            <input id="swal2-input${Number(inputId)}" placeholder="${label}" value="${value}"></input>
        </div>        
    `
}