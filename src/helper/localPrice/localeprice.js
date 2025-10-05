export const formatNumberWithCommas = (number, trailingzeros = false) => {
    // Convert to number first
    const num = Number(number);
    
    // Check if the conversion was successful
    if (isNaN(num)) {
      // If not a valid number, return the original as string
      return String(number);
    }

    if( trailingzeros) {
      return num.toLocaleString('en-US');
    }
    // Format with commas
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
};