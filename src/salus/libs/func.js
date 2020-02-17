import { CodeToText } from 'element-china-area-data';

function parseCityCode (val) {
  return typeof val === 'string' ? [
    `${val.slice(0, 2)}0000`,
    `${val.slice(0, 2)}${val.slice(2, 4)}00`,
    `${val.slice(0, 2)}${val.slice(2, 4)}${val.slice(4, 6)}`
  ] : [];
}

export default class Func {
  static transformCodeToCityName = (str) => {
    const array = parseCityCode(str);
    let place = '';
    const province = array[0];
    const city = array[1];
    const area = array[2];
    if (province !== undefined) place = CodeToText[province] + '';
    if (city !== undefined) place += (CodeToText[city] || '') + '';
    if (area !== undefined) place += (CodeToText[area] || '') + '';
    return place;
  };
}
