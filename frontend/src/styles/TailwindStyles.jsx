export const baseStyles = ` mb-2 `;
export const titleStyles = ` text-5xl font-bold uppercase text-amber-600` + baseStyles;
export const mainTextStyles = ` text-amber-800 text-2xl `;
export const buttonStyles = mainTextStyles + ` p-1 fill-amber-600 bg-amber-600 rounded text-white border-amber-800 + border-2` + baseStyles;
export const labelStyles = ` mr-2 font-bold ` + baseStyles + mainTextStyles;
export const textboxStyles = ` rounded border-amber-800 border-2 bg-amber-200 p-1` + baseStyles;
export const linkStyles = " font-bold italic " + mainTextStyles + baseStyles;
export const errorStyles = " text-red-600 font-bold text-sm" + baseStyles;
export const formContainerStyles = " items-center text-center align-middle bg-amber-100 size-fit m-3 p-6 rounded-2xl shadow-2xl shadow-black h-3/4 self-center";
export const backgroundStyles = " bg-linear-to-r from-amber-950 to-amber-900 items-center align-middle place-content-center min-h-screen max-h-screen min-w-screen max-w-screen flex ";

// export const LoginRegisterContainerStyles = `text-center`;
export default baseStyles;