from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get environment variables directly from Vercel
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

app = Flask(__name__)
# Configure CORS to allow requests from any origin
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api', methods=['GET'])
def home():
    return jsonify({"status": "Server is running"})

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"status": "API endpoint is working"})

@app.route('/api/execute', methods=['POST'])
def execute():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        script = data.get("script", "")
        if not script:
            return jsonify({"error": "No script provided"}), 400
        
        if not CLIENT_ID or not CLIENT_SECRET:
            return jsonify({"output": "Mock output for testing. JDoodle credentials not properly configured."}), 200
        
        # Proceed with sending the request to JDoodle
        payload = {
            "clientId": CLIENT_ID,
            "clientSecret": CLIENT_SECRET,
            "script": script,
            "stdin": data.get("stdin", ""),
            "language": "nasm",
            "versionIndex": "0"
        }
        
        response = requests.post("https://api.jdoodle.com/v1/execute", json=payload)
        response.raise_for_status()
        result = response.json()
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in execute endpoint: {str(e)}")
        return jsonify({"output": f"Server error occurred: {str(e)}"}), 200

# This is for Vercel serverless functions
app = app
