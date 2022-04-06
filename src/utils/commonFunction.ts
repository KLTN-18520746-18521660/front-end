import { HttpErrorResponse } from "@angular/common/http";
import _ from 'lodash';

export const handleError = (error?: HttpErrorResponse) => {
  let obj = {};
  var statusMapping = {
    404: "Not Found",
    400: "Bad Request",
  };
  if (error.error instanceof ErrorEvent) {
    obj = {
      message: error.statusText,
      status: error.status,
      error: error.error.message,
    };
  }
  else {
    obj = {
      message: statusMapping[error.status],
      status: error.status,
      error: (error.error.error)
    };
    // switch (error.status) {
    //   case 404:
    //     obj = {
    //       message: "Not Found",
    //       status: error.status,
    //       error: (error.error.error)
    //     };
    //     break;
    //   case 403:
    //     obj = {
    //       message: "Access Denied",
    //       status: error.status,
    //       error: (error.error.error)
    //     };
    //     break;
    //   case 500:
    //     obj = {
    //       message: "Internal Server Error",
    //       status: error.status,
    //       error: (error.error.error)
    //     };
    //     break;
    //   default:
    //     obj = {
    //       message: "Unknown Server Error",
    //       status: error.status,
    //       error: (error.message)
    //     };
    //     break;
    // };
  }
  return obj;
}

export const addDay = (addDay: number, day: Date = new Date) => {
  const date = new Date(day);
  date.setDate(date.getDate() + addDay);
  return date;
}

export const minusDay = (minusDay: number, day: Date = new Date) => {
  const date = new Date(day);
  date.setDate(date.getDate() - minusDay);
  return date;
}

export const randomArray = (arr: any[], length: number, getOne: boolean = false) => {
  if (length < 0)
    return arr;
  if (length === 1 && getOne)
    return _.sample(arr);
  else
    return _.sampleSize(arr, length);
}

export const convertViToEn = (str) => {
  str = str.normalize('NFD')
    .replace(/\s\s+/g, ' ')	// Replaces multiple hyphens by one hyphen
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[-,\/]/g, "-")
    .replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '')	// Remove special characters
    .replace(/\s/g, '-') // Replace space to '-'
    .replace(/\-\-+/g, '-')	// Replaces multiple hyphens by one hyphen

  return encodeURI(str);
}

export const convertArrayToNested = (list, key = 'parent_id') => {
  const result = list.reduce((acc, item) => {
    acc.set(item.id, item)

    const parent = item[key] === null
      ? acc.get('root')
      : (acc.get(item[key]).children ??= [])

    parent.push(item)

    return acc
  }, new Map([['root', []]])).get('root');

  return result;
}