// Persian and financial formatters for Iranian Tomans

export const formatTomans = (amountTomans: number): string => {
  if (isNaN(amountTomans) || amountTomans === 0) return '۰ تومان';
  
  if (Math.abs(amountTomans) >= 1_000_000_000) {
    const billions = amountTomans / 1_000_000_000;
    return `${billions.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیارد تومان`;
  }
  
  if (Math.abs(amountTomans) >= 1_000_000) {
    const millions = amountTomans / 1_000_000;
    return `${millions.toLocaleString('fa-IR', { maximumFractionDigits: 1 })} میلیون تومان`;
  }
  
  return `${amountTomans.toLocaleString('fa-IR')} تومان`;
};

export const formatNumberFa = (num: number, digits: number = 0): string => {
  if (isNaN(num)) return '۰';
  return num.toLocaleString('fa-IR', { maximumFractionDigits: digits });
};

export const formatPercentFa = (percent: number, digits: number = 1): string => {
  if (isNaN(percent)) return '۰٪';
  return `${percent.toLocaleString('fa-IR', { maximumFractionDigits: digits })}٪`;
};

export const toEnglishDigits = (str: string): string => {
  return str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
};

export const parseIranianCurrencyInput = (input: string): number => {
  const cleanStr = toEnglishDigits(input).replace(/,/g, '').trim();
  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : val;
};
