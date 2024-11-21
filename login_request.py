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