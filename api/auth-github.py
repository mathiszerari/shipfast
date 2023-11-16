from fastapi import FastAPI, Request
import httpx
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

app = FastAPI()
github_client_id = 'eff2af781a226c4fcd5a'
github_client_secret = '124d9004aca6ea359b1f3838b32041e53116626b'

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/github-login")
async def github_login():
    return RedirectResponse(f'https://github.com/login/oauth/authorize?client_id={github_client_id}', status_code=303)

@app.get("/api/github-token")
async def github_code(code: str):
  params = {
      'client_id': github_client_id,
      'client_secret': github_client_secret,
      'code': code
  }
  headers = {'Accept': 'application/json'}
  async with httpx.AsyncClient() as client:
      response = await client.post(
          'https://github.com/login/oauth/access_token', params=params, headers=headers
      )
  response_json = response.json()
  access_token = response_json.get('access_token')

  return access_token

@app.get("/api/github-user")
async def github_user(access_token: str):
  async with httpx.AsyncClient() as client:
    headers = {'Accept': 'application/json','Authorization': f'Bearer {access_token}'}
    response = await client.get('https://api.github.com/user', headers=headers)
  return response.json()