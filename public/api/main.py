import json
import requests
import os
import warnings
import uvicorn
from fastapi import FastAPI, Request, HTTPException, Body, File, UploadFile, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from hashlib import sha256

warnings.filterwarnings("ignore", message="Unverified HTTPS request")
app = FastAPI()

# 允许来源访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:2233"],  # 限制为前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def request_data(openid, url, body, content_type, post):
    headers = {
        'imprint': openid,
        'Content-Type': content_type,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'xweb_xhr': '1'
    }
    print(body)
    body_data = body if body else None

    if post:
        print(body_data)
        response = requests.post(
            url,
            json = body_data,
            headers=headers,
            verify = False
        )
    else:
        response = requests.get(url, headers = headers, verify = False)

    # 检查响应状态码
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"请求错误，状态码: {response.status_code}，返回内容: {response.text}"
        )

    # 检查响应内容是否为空
    if not response.text:
        raise HTTPException(
            status_code=500,
            detail="返回内容为空，无法解析为 JSON"
        )

    # 尝试解析 JSON 数据
    try:
        return json.loads(response.text)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"JSON 解析失败：{e}，原始响应内容：{response.text}"
        )

class ApiRequest(BaseModel):
    code: str
    post: str
    url: str
    openid: str
    body: Optional[Dict[str, Any]]
    content_type: str = "application/x-www-form-urlencoded"

@app.post("/apis")
async def handle_request(data: ApiRequest = Body(...)):
    is_post = data.post.lower() == 'true'
    
    if len(data.code) != 64:
        raise HTTPException(status_code=403, detail="Denied!")
    
    # Authorization Codes FOR ROOT
    authorized_codes_root = {
        sha256("root20252025".encode()).hexdigest(),
        sha256("#root~@bjxgjHelper".encode()).hexdigest()
    }
    
    if data.code in authorized_codes_root:
        return request_data(data.openid, data.url, data.body, data.content_type, is_post)
    
    # Authorization Codes FOR User
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        JSON_FILE_PATH = os.path.join(BASE_DIR, 'classListByCode.json')
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            class_list_by_code_info = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=403, detail="Denied!")
    
    if data.code in class_list_by_code_info:
        if any(keyword in data.url for keyword in ["getTeacher?", "ocr_socre_preview", "getParent", "getClassByMemberId"]): # 限定访问权限
            return request_data(data.openid, data.url, data.body, data.content_type, is_post)
    
    raise HTTPException(status_code=403, detail="Denied!")

def get_class_list_by_code(code: str):
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        JSON_FILE_PATH = os.path.join(BASE_DIR, 'classListByCode.json')
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            codes_info = json.load(f)
        return codes_info.get(code, [])
    except FileNotFoundError:
        return []

@app.post("/getClassListByCode")
async def class_list(request: Request):
    data = await request.json()
    authorization_code = data.get('code')
    if authorization_code:
        class_list_data = get_class_list_by_code(authorization_code)
        return class_list_data
    return []

if __name__ == '__main__':
    uvicorn.run('main:app', port=2234)