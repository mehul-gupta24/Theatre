const isoTimeFormat = (dateTime) => {
    const date = new Date(dateTime)
    // Use UTC time to avoid timezone conversion
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minutesStr = String(minutes).padStart(2, '0');
    return `${hour12}:${minutesStr} ${ampm}`;
}

export default isoTimeFormat

// export default isoTimeFormat