export const stringifyQuery = (query: { [key: string]: string }): string =>
  Object.keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join('='))
    .join('&');

export default (url: string, params?: Record<string, string>): string =>
  `${process.env.REACT_APP_API_URL || ''}/pub/${url}${
    params ? `?${stringifyQuery(params)}` : ''
  }`;
