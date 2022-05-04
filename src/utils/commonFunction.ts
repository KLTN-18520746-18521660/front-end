import { HttpErrorResponse } from "@angular/common/http";
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

export const handleError = (error?: HttpErrorResponse) => {
  let obj = {
    message: '',
    status: 0,
    error: '',
  };
  console.log(error)

  const mapStatusCode = {
    0: "Unknown Error",
    400: "Request Error",
    401: "Session Error",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    500: "Internal Server Error",
  };

  if (error.error instanceof ErrorEvent) {
    obj = {
      error: error.error.message,
      status: error.status,
      message: error.statusText,
    };
  }
  else if (error.error instanceof ProgressEvent) {
    obj = {
      error: '',
      status: error.status,
      message: error.message,
    };
  }
  else if (error?.error?.data) {
    const err = Object.values(error?.error?.data) as [];
    obj = {
      error: error.error.message,
      status: error.status,
      message: err.join(', '),
    }
  }
  else {
    obj = {
      error: mapStatusCode[error.status],
      status: error.status,
      message: error.error?.message,
    };
  }
  console.log(obj);
  return obj;
}

export const convertDateTime = (
  date: string,
  locale: string,
  suffix: boolean = true,
) => {
  dayjs.locale(locale);

  if (dayjs().diff(date, 'hour') < 12) {
    dayjs.extend(relativeTime);
    return dayjs(date).fromNow(suffix);
  }
  else if (dayjs().diff(date, 'day') < 1) {
    dayjs.extend(calendar);
    return dayjs(date).calendar();
  }
  else if (dayjs().diff(date, 'month') < 1) {
    return dayjs(date).format('MMMM D, HH:mm');
  }
  else if (dayjs().diff(date, 'month') < 12) {
    return dayjs(date).format('MMMM D, HH:mm');
  }
  else {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }
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

export const convertToSlug = (str) => {
  str = str.normalize('NFD')
    .replace(/\s\s+/g, ' ')	// Replaces multiple hyphens by one hyphen
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[-,\/]/g, "-")
    .replace(/[~`!@#$%^&*'()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '')	// Remove special characters
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

export const removeChildrenByLevel = (list, maxLevel = 3, level = 0) => {
  if (level >= maxLevel) {
    list.map(item => {
      item.children = [];
    })
    return list;
  }
  else {
    list.map(item => {
      if (item.children) {
        removeChildrenByLevel(item.children, maxLevel, level + 1);
      }
    })
    return list;
  }
}

export const getDifferenceObject = (obj1, obj2) => {
  const diff = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        diff[key] = obj2[key];
      }
    }
  }
  return diff;
}

export const localStorageFunctions = {
  getConfigs: () => {
    return localStorage.getItem('CONFIGS') ? JSON.parse(localStorage.getItem('CONFIGS')) : {};;
  },
  getConfigByKey: (key: string) => {
    let configs = localStorage.getItem('CONFIGS') ? JSON.parse(localStorage.getItem('CONFIGS')) : {};
    return configs[key] || null;
  },
  addConfig: (key, value) => {
    const configs = localStorage.getItem('CONFIGS') ? JSON.parse(localStorage.getItem('CONFIGS')) : {};
    localStorage.setItem('CONFIGS', JSON.stringify({ ...configs, [key]: value }));
  }
}

//Map Action 
export const mapActionWithPost = (action: string[]) => {
  // action = ["Visited", "Like", "Follow", "Dislike", "Comment", "Saved", "Report"];
  const mapAction = {
    like: action.includes('Like'),
    dislike: action.includes('Dislike'),
    comment: action.includes('Comment'),
    saved: action.includes('Saved'),
    report: action.includes('Report'),
    visited: action.includes('Visited'),
    follow: action.includes('Follow')
  }
  return mapAction;
}

export const mapActionWithComment = (action: string[]) => {
  // action = ["Like", "Dislike", "Report", "Reply"];
  const mapAction = {
    like: action.includes('Like'),
    dislike: action.includes('Dislike'),
    report: action.includes('Report'),
    reply: action.includes('Reply'),
  }
  return mapAction;
}

export const mapActionWithTag = (action: string[]) => {
  // action = ["Follow", "Used", "Visited"];
  const mapAction = {
    follow: action.includes('Follow'),
    used: action.includes('Used'),
    visited: action.includes('Visited'),
  }
  return mapAction;
}

export const mapActionWithCategory = (action: string[]) => {
  // action = ["Follow"];
  const mapAction = {
    follow: action.includes('Follow'),
  }
  return mapAction;
}

export const mapActionWithUser = (action: string[]) => {
  // action = ["Follow", "Report"];
  const mapAction = {
    follow: action.includes('Follow'),
    report: action.includes('Report'),
  }
  return mapAction;
}