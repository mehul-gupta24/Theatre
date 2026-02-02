const timeFormat = (min) => {
    const hr = Math.floor(min/60);
    const minRem = min%60;
    return `${hr}h ${minRem}m`;
}
export default timeFormat;