/* 
  sample: 
    modify the user-agent in requests toward httpbin.org
  test:
    curl http://httpbin.org/user-agent --proxy http://127.0.0.1:8001
*/
module.exports = {
  *beforeSendRequest(requestDetail) {
    const newRequestOptions = requestDetail.requestOptions;
    newRequestOptions.headers.Host = "www.baidu.com"
    newRequestOptions.hostname = "www.baidu.com"
    newRequestOptions.port = 80;
     return {
      requestOptions: newRequestOptions
    };
  },
};
