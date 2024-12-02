import requests
import json

BASE_URL = 'https://en.wikipedia.org/w/api.php'
session = requests.Session()

# Get login token
def login_token():        
    params = {
        'action': 'query',
        'meta': 'tokens',
        'type': 'login',
        'format': 'json'
    }

    response = session.get(BASE_URL, params=params)
    if response.status_code == 200:
        login_token = response.json()['query']['tokens']['logintoken']
        return login_token

def login(USERNAME, PASSWORD):
    if USERNAME:
        if PASSWORD:
            login_params = {
                'action': 'clientlogin',
                'format': 'json',
                'loginreturnurl': 'https://en.wikipedia.org/wiki/Main_Page',
                'username': USERNAME,
                'password': PASSWORD,
                'logintoken': login_token()
            }

            login_response = session.post(BASE_URL, data=login_params)
            if 'error' in login_response.json():
                return False
            else:
                if login_response.json()["clientlogin"]["status"] == "PASS":
                    # login chacking 
                    print("login is succsess!")
                    return True
                else:
                    return False
        else:
            return json.dumps({"error": "Password is required!"})
    else:
        return json.dumps({"error": "Username is required!"})

# Get CSRF token
def get_csrf_token():
    params = {
        'action': 'query',
        'meta': 'tokens',
        'format': 'json'
    }
    response = session.get(BASE_URL, params=params)
    if response.status_code == 200:
        return response.json()['query']['tokens']['csrftoken']
    else:
        return "Failed to fetch CSRF token"

# wiki sandbox content fetch 

import requests

session = requests.Session()

def fetch_sandbox_content(username):
    sandbox_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=User:{username}/sandbox&rvprop=content&format=json"

    response = session.get(sandbox_url)
    if response.status_code == 200:
        data = response.json()
        page = list(data['query']['pages'].values())[0]
        if 'revisions' in page:
            sandbox_content = page['revisions'][0]['*']
            return sandbox_content
        else:
            return "No content in found in sandbox."
    else:
        return f"Error fetching data: {response.status_code}"

# wikipediya user name 
# USERNAME = "<User-name>"  
# content = fetch_sandbox_content(USERNAME)


# Edit sandbox content
def edit_sandbox(username, new_content):
    csrf_token = get_csrf_token()

    edit_params = {
        'action': 'edit',
        'title': f"User:{username}/sandbox",
        'text': new_content,
        'token': csrf_token,
        'format': 'json'
    }

    response = session.post(BASE_URL, data=edit_params)
    edit_data = response.json()

    if 'edit' in edit_data and edit_data['edit']['result'] == 'Success':
        print(f"Successfully edited sandbox for {username}")
    else:
        return "Edit unsuccessful."

