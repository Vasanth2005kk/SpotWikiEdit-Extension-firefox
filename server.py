from flask import Flask, request, jsonify, make_response
import os
from flask_cors import CORS
import login_request 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = os.urandom(12).hex()


@app.route("/Botlogin", methods=["POST"])
def index():
    if request.method == "POST":
        data = request.get_json()
        if login_request.login(USERNAME=data['UserName'],PASSWORD=data['Password']):
            # chacking data
            print(f"Received data: {data}")
            return make_response(jsonify({"status": "success"}), 200)
    return make_response(jsonify({"status": "failed"}), 400)

@app.route('/SandBoxEdit',methods=['POST'])
def sandboxedit():
    if request.method == 'POST':
        data = request.get_json()
        if 'UserName' in data:
            print(f"Sandbox Received data: {data}")
            return make_response(jsonify({"status": "success"}), 200)
    return make_response(jsonify({"status": "failed"}), 400)

if __name__ == '__main__':
    app.run(debug=True)
