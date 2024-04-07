from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
heart_rate_data_per_user = {}
username = ''

def process_heart_rate_data(username):
    global heart_rate_data_per_user
    data = heart_rate_data_per_user.get(username, [])
    print(f"Heart rate data for {username}: {data}")


@app.route('/hook', methods=['POST'])
def receive_heart_rate_data():
    global heart_rate_data_per_user
    global username

    data = request.json
    pinValue = data.get('pinValue')
    timestamp = time.time()

    # check if all existing username data is withing last 60 seconds
    # if not then delete previous data which is older than 60 seconds
    # data = {
    #   'user1': [[60, 1630000000], [70, 1630000001], [80, 1630000002], [90, 1630000003]],
    # }

    if username not in heart_rate_data_per_user:
        heart_rate_data_per_user[username] = []
    
    current_time = time.time()

    for hb in heart_rate_data_per_user[username]:
        print(f"Current time: {current_time}, hb: {hb}")
        if current_time - hb[1] > 60:
            heart_rate_data_per_user[username].remove(hb)
    heart_rate_data_per_user[username].append([pinValue, timestamp])

    process_heart_rate_data(username)
    return jsonify({'message': 'Heart rate data received successfully'}), 200


@app.route('/hb', methods=['GET'])
def get_heart_rate_data():
    global heart_rate_data_per_user
    global username
    data = heart_rate_data_per_user.get(username, [])
    return jsonify({'heart_rate_data': data}), 200


@app.route('/hb', methods=['DELETE'])
def delete_heart_rate_data():
    global heart_rate_data_per_user
    global username
    if username in heart_rate_data_per_user:
        del heart_rate_data_per_user[username]
    return jsonify({'message': f'Heart rate data of username {username} deleted successfully'}), 200


@app.route('/all', methods=['GET'])
def get_all_heart_rate_data():
    global heart_rate_data_per_user
    return jsonify(heart_rate_data_per_user), 200

@app.route('/username', methods=['GET'])
def set_username():
    global username
    user = request.args.get('user')
    username = user
    return jsonify({'message': f'Username set to {user}'}), 200


if __name__ == '__main__':
    app.run(debug=True)
