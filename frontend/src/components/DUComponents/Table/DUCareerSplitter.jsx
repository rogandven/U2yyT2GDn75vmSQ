import { SEPARATOR } from "../../../constants/CareerConstants.jsx";

const styles = ["badge badge-primary", "badge badge-secondary", "badge badge-accent", "badge badge-neutral", "badge badge-info", "badge badge-success", "badge badge-warning", "badge badge-error"];

export const DUCareerSplitter = (career) => {
    if (typeof(career) !== "string") {
        return (<div></div>);
    }
    const parsedString = career.split(SEPARATOR);
    const elementArray = [];
    for (let i = 0; i < parsedString.length; i++) {
        elementArray.push((
            <div class={styles[i % styles.length] + " m-1"}>{parsedString[i]}</div>
        ))
    }
    return (<div>{elementArray.map((i) => i)}</div>);
}