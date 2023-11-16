from fastapi import FastAPI
import httpx
from starlette.responses import RedirectResponse

app = FastAPI()
github_client_id = 'eff2af781a226c4fcd5a'
github_client_secret = '124d9004aca6ea359b1f3838b32041e53116626b'


@app.get("/api/github-login")
async def github_login():
    return RedirectResponse(f'https://github.com/login/oauth/authorize?client_id={github_client_id}', status_code=303)

@app.get("/api/github-code")
async def github_code(code: str):
    params = {
        'client_id': github_client_id,
        'client_secret': github_client_secret,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    async with httpx.AsyncClient() as client:  # Correction ici
        response = await client.post(
            'https://github.com/login/oauth/access_token', params=params, headers=headers  # Correction ici
        )
    response_json = response.json()
    access_token = response_json.get('access_token')

    async with httpx.AsyncClient() as client:
        headers.update({'Authorization' : f'Bearer {access_token}'})
        response = await client.get('https://api.github.com/user', headers=headers)
    return response.json()