export const numToThousand = (number) => {
    if(number > 1000){
        return (number / 1000).toFixed(1) + "k"

    }
    return number;
}