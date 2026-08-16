export const dateFormat = (date) => {
    const d = new Date(date);
    // Use UTC to avoid timezone conversion
    const weekday = d.toLocaleString('en-US', {weekday:'short', timeZone: 'UTC'});
    const month = d.toLocaleString('en-US', {month:'long', timeZone: 'UTC'});
    const day = d.getUTCDate();
    const hours = d.getUTCHours();
    const minutes = d.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minutesStr = String(minutes).padStart(2, '0');
    return `${weekday}, ${month} ${day}, ${hour12}:${minutesStr} ${ampm}`;
}