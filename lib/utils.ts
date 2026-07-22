


export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
    }).format(amount);
};

export const formatCapacity = (capacity: string | number) => {
    if (!capacity) return "";
    const str = String(capacity).trim();
    const num = str.replace(/[^0-9.]/g, "");
    if (num) {
        return `${num} Litres`;
    }
    return str;
};

