from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get environment variables
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

app = Flask(__name__)
# Configure CORS to allow requests from your Vercel domain
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://assembly-learning-platform-e1izbaen0.vercel.app",
            "http://localhost:5173",  # For local development
            "http://localhost:3000"   # For local development
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

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
            logger.error("JDoodle credentials not configured")
            return jsonify({"error": "JDoodle API credentials not properly configured"}), 500
        
        # Proceed with sending the request to JDoodle
        payload = {
            "clientId": CLIENT_ID,
            "clientSecret": CLIENT_SECRET,
            "script": script,
            "stdin": data.get("stdin", ""),
            "language": "nasm",
            "versionIndex": "0"
        }
        
        response = requests.post(
            "https://api.jdoodle.com/v1/execute",
            json=payload,
            timeout=30  # Set a reasonable timeout
        )
        response.raise_for_status()
        result = response.json()
        
        return jsonify({
            "output": result.get("output", ""),
            "statusCode": result.get("statusCode", 200),
            "memory": result.get("memory", ""),
            "cpuTime": result.get("cpuTime", "")
        })
    except requests.exceptions.RequestException as e:
        logger.error(f"JDoodle API error: {str(e)}")
        return jsonify({"error": "Failed to execute code. Please try again later."}), 503
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# This is important for Vercel
app = app
