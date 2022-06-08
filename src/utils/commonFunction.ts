import { HttpErrorResponse } from "@angular/common/http";
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import { SortMeta } from "models/table.model";
import md from 'markdown-it';

export const handleError = (error?: HttpErrorResponse) => {
  let obj = {
    message: '',
    status: 0,
    error: '',
    message_code: ''
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

  if (error.error instanceof ErrorEvent as any) {
    obj = {
      error: error.error.message,
      status: error.status,
      message: error.statusText,
      message_code: error.error.message_code || ''
    };
  }
  // else if (error.error instanceof ProgressEvent as any) {
  //   obj = {
  //     error: '',
  //     status: error.status,
  //     message: error.message,
  //     message_code: error.error.message_code || ''
  //   };
  // }
  else if (error?.error?.data) {
    const err = Object.values(error?.error?.data) as [];
    obj = {
      error: error.error.message,
      status: error.status,
      message: err.join(', '),
      message_code: error.error.message_code || ''
    }
  }
  else {
    obj = {
      error: mapStatusCode[error.status],
      status: error.status,
      message: error.error?.message,
      message_code: error.error.message_code || ''
    };
  }
  console.log(obj);
  return obj;
}

export const convertDateTime = (
  date: string,
  locale: string,
  suffix: boolean = true,
  showTime: boolean = true,
  fromNow: boolean = false,
) => {
  dayjs.locale(locale);

  if (fromNow) {
    dayjs.extend(relativeTime);
    return dayjs(date).fromNow(suffix);
  }
  else if (dayjs().diff(date, 'hour') < 12) {
    dayjs.extend(relativeTime);
    return dayjs(date).fromNow(suffix);
  }
  else if (dayjs().diff(date, 'day', true) < 1) {
    dayjs.extend(calendar);
    return dayjs(date).calendar();
  }
  else if (dayjs().diff(date, 'month', true) < 1) {
    if (locale === 'vi') {
      return showTime ? dayjs(date).format('D MMMM, HH:mm') : dayjs(date).format('D MMMM');
    }
    return showTime ? dayjs(date).format('MMMM D, HH:mm') : dayjs(date).format('MMMM D');
  }
  else if (dayjs().diff(date, 'month', true) < 12) {
    if (locale === 'vi') {
      return showTime ? dayjs(date).format('D MMMM, HH:mm') : dayjs(date).format('D MMMM');
    }
    return showTime ? dayjs(date).format('MMMM D, HH:mm') : dayjs(date).format('MMMM D');
  }
  else {
    return showTime ? dayjs(date).format('DD/MM/YYYY HH:mm') : dayjs(date).format('DD/MM/YYYY');
  }
}

export const convertMarkdown = (text: string = '') => {
  const markdownIt = md();
  return markdownIt.render(text || '');
}

export const convertLinkRedirecting = (str: string) => {
  str = str.replace(/<a[^>]*href=["']([^"']*)["']/g, (item) => {
    item = item.replace(/(?<=href=[\'\"])([^\'\"]+)/gm, (match) => {
      return `${window.location.origin}/goto?url=${match}`;
    })
    return item;
  })
  return str;
}

export const getDiffDay = (date: string) => {
  return dayjs().diff(date, 'day', true);
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

export const getDifferenceObject = (oldObject, newObject) => {
  const diff = {};
  for (const key in oldObject) {
    if (oldObject.hasOwnProperty(key)) {
      if (!_.isEqual(oldObject[key], newObject[key])) {
        diff[key] = newObject[key];
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

//#region function for p-table 

export const convertToMultiSortMeta = (sort: string, order: string): SortMeta[] => {
  const sortBy = sort ? sort.split(',') : null;
  const orderBy = order ? order.split(',') : null;
  if (!sortBy && !orderBy) {
    return null;
  }
  return sortBy.map((item, index) => {
    return {
      field: item,
      order: (orderBy[index] ? orderBy[index] : 'desc') === 'desc' ? 1 : -1
    }
  });
}

export const convertToFilterMeta = (filter: string) => {
  const filterBy = filter ? filter.split(',') : null;
  if (!filterBy) {
    return null;
  }
  return filterBy.map((item, index) => {
    return {
      field: item,
      filter: 'contains',
      filterMatchMode: 'contains'
    }
  });
}
//#endregion

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