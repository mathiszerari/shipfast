from fastapi import FastAPI
from starlette.responses import RedirectResponse

app = FastAPI()
github_client_id = 'eff2af781a226c4fcd5a'


@app.get("/api/github-login")
async def github_login():
  return RedirectResponse(f'https://github.com/login/oauth/authorize?client_id={github_client_id}', status_code=303)

@app.get("/api/github-code")
async def github_code(code: str):
  print(code)