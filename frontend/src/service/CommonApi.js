import axios from "axios";

export const commonApi = (httpRequest, url, reqBody=null) => {
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
  };

  return axios(reqConfig)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
};