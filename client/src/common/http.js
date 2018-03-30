import qs from "qs";
import { error } from "./error";

export const defaultHeaders = () => ({
  credentials: "include"
});

export const isJsonResponse = response => {
  const contentType = response.headers.get("content-type");
  return contentType === null || contentType.indexOf("application/json") > -1;
};

export const formatError = response =>
  `${response.status} ${response.statusText}`;

export const statusError = response =>
  error(formatError(response), response.status);

export const http = (url, { proxy = "", params = null, ...options } = {}) =>
  fetch(`${proxy}${url}?${qs.stringify(params)}`, {
    ...defaultHeaders(),
    ...options
  }).then(response => {
    if (!response.ok) {
      throw statusError(response);
    }
    return isJsonResponse(response) ? response.json() : response.text();
  });

export const get = (url, options = {}) => http(url, options);

export const post = (url, options = {}) =>
  http(url, { method: "post", ...options });
