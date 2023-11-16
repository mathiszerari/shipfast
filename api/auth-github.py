from fastapi import FastAPI, Request
import httpx
from starlette.responses import RedirectResponse

app = FastAPI()
github_client_id = 'eff2af781a226c4fcd5a'
github_client_secret = '124d9004aca6ea359b1f3838b32041e53116626b'


@app.get("/api/github-login")
async def github_login():
    return RedirectResponse(f'https://github.com/login/oauth/authorize?client_id={github_client_id}', status_code=303)

@app.get("/api/github-code")
async def github_code(code: str, request: Request = str()):
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

    async with httpx.AsyncClient() as client:
        headers.update({'Authorization' : f'Bearer {access_token}'})
        response = await client.get('https://api.github.com/user', headers=headers)
      
    user_data = response.json()
    print(user_data)
    
    # Remplacez "http://localhost:4200" par le chemin/route correcte de votre application Angular
    redirect_url = "http://localhost:4200/"
    
    # Utilisez RedirectResponse pour rediriger l'utilisateur
    return RedirectResponse(url=redirect_url + user_data['login'], status_code=303)