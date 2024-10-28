export const battryCSS = (figure: number | string) => {
  const value = typeof figure === 'string' ? parseFloat(figure) : figure;

  if (value > 1) {
    return 'above1 h-full';
  } else if (value == 1) {
    return 'one h-9'; 
  } else if (value >= 0.51) {
    return 'btw051_099 h-8'; 
  } else if (value > 0.29) {
    return 'btw03_05 h-5';
  } else {
    return 'below03 h-full';
  }
};