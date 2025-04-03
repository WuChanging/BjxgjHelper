import axios from 'axios'

export function request(url: any, body = {}, openid: any, post = false, call: (arg0: any) => void, contentType?: string) {
  if (contentType === undefined) contentType = 'application/x-www-form-urlencoded'
  axios({
    method: 'post',
    url: '/api/apis',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      code: localStorage.getItem("authorizationCode"),
      post: post ? "true" : "false",
      url: url,
      openid: openid,
      body: body,
      content_type: contentType
    }
  }).then((res) => {
    call(res)
  }).catch((errors) => {
    console.log(errors)
  })
}