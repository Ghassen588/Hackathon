import os
import json
import random
from flask import Flask, request, jsonify, render_template, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from extensions import db, bcrypt, login_manager

# --- App Factory Function ---
def create_app():
    """Creates and configures the Flask application."""
    
    app = Flask(__name__, template_folder='templates', static_folder='static')
    
    # --- Configuration ---
    # Set a secret key for session management
    app.config['SECRET_KEY'] = 'a_very_secret_key_that_should_be_changed'
    
    # Configure the SQLite database
    # It will be created in the 'instance' folder
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'smart_farm.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- Initialize Extensions ---
    # Connect the extensions to the Flask app instance
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    
    # --- Configure CORS ---
    # Allow requests from your React app's origin
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}}) # Loosened for fetch fix

    # --- Import Models ---
    # This MUST be done after db.init_app(app) to avoid circular imports
    # We import it here so that the models are registered with SQLAlchemy
    with app.app_context():
        # --- FIX: Removed 'SlimmyZone' from import ---
        from models import User
        
        # Create database tables if they don't exist
        db.create_all()

    # --- Flask-Login User Loader ---
    @login_manager.user_loader
    def load_user(user_id):
        from models import User
        return User.query.get(int(user_id))
    
    @login_manager.unauthorized_handler
    def unauthorized():
        """Handle unauthorized access."""
        return jsonify({"error": "Unauthorized"}), 401

    # --- JSON File Helper Functions for Map Data ---
    
    # Define the path for the map data JSON file
    MAP_DATA_FILE = os.path.join(basedir, 'map_data.json')

    def load_map_data():
        """Loads the entire map data from map_data.json."""
        if not os.path.exists(MAP_DATA_FILE):
            return {}
        try:
            with open(MAP_DATA_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}

    def save_map_data(data):
        """Saves the entire map data to map_data.json."""
        with open(MAP_DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
            
    def get_user_map_data(cin):
        """Gets map data for a specific user CIN."""
        all_data = load_map_data()
        return all_data.get(str(cin))

    def create_initial_map_data(cin):
        """Creates and saves initial map data for a new user."""
        all_data = load_map_data()
        
        # Define the structure and lengths of the zones
        zone_config = {
            'tomatoes': 5,
            'onions': 6,
            'mint': 4
        }
        
        new_user_data = {
            'soil': {},
            'pumps': {}
        }
        
        for plant, length in zone_config.items():
            new_user_data['soil'][plant] = [random.choice([True, False]) for _ in range(length)]
            new_user_data['pumps'][plant] = [random.choice([True, False]) for _ in range(length)]
            
        all_data[str(cin)] = new_user_data
        save_map_data(all_data)
        return new_user_data

    # --- API Routes ---

    @app.route('/api/signup', methods=['POST'])
    def api_signup():
        from models import User # Import here to avoid circular import issues
        
        data = request.get_json()
        username = data.get('username')
        cin = data.get('cin')
        password = data.get('password')

        if not all([username, cin, password]):
            return jsonify({"error": "Missing data"}), 400

        if len(cin) != 8 or not cin.isdigit():
            return jsonify({"error": "CIN must be 8 digits"}), 400
            
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # Check if user (CIN) already exists in SQLite
        if User.query.filter_by(cin=cin).first():
            return jsonify({"error": "This code (CIN) is already taken"}), 409

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create new user in SQLite
        new_user = User(username=username, cin=cin, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        # --- NEW: Create map data in JSON file ---
        create_initial_map_data(cin)
        
        # Log in the new user
        login_user(new_user)
        
        return jsonify({
            "id": new_user.id,
            "username": new_user.username,
            "cin": new_user.cin
        }), 201

    @app.route('/api/login', methods=['POST'])
    def api_login():
        from models import User # Import here
        
        data = request.get_json()
        cin = data.get('cin')
        password = data.get('password')

        if not cin or not password:
            return jsonify({"error": "Missing CIN or password"}), 400

        user = User.query.filter_by(cin=cin).first()

        # Check if user exists and password is correct
        if user and bcrypt.check_password_hash(user.password_hash, password):
            login_user(user)
            session.permanent = True  # Keep user logged in
            return jsonify({
                "id": user.id,
                "username": user.username,
                "cin": user.cin
            }), 200

        return jsonify({"error": "Invalid CIN or password"}), 401

    @app.route('/api/logout', methods=['POST'])
    @login_required
    def api_logout():
        logout_user()
        return jsonify({"message": "Logout successful"}), 200

    @app.route('/api/session')
    def api_session():
        """Checks if a user is currently logged in."""
        if current_user.is_authenticated:
            return jsonify({
                "id": current_user.id,
                "username": current_user.username,
                "cin": current_user.cin
            }), 200
        else:
            return jsonify({"error": "Not logged in"}), 401
            
    @app.route('/api/map_data')
    @login_required
    def api_map_data():
        """Gets the map data for the currently logged-in user from the JSON file."""
        user_cin = current_user.cin
        map_data = get_user_map_data(user_cin)
        
        if not map_data:
            # This is a fallback in case user was created but map data wasn't
            map_data = create_initial_map_data(user_cin)
            
        return jsonify(map_data), 200

    @app.route('/api/weather')
    @login_required
    def api_weather():
        """Provides mock weather data."""
        mock_weather = [
            {'day': 'Today', 'emoji': '☀️', 'high': '28°', 'low': '16°'},
            {'day': 'Tomorrow', 'emoji': '⛅️', 'high': '26°', 'low': '15°'},
            {'day': 'In 2 Days', 'emoji': '🌧️', 'high': '22°', 'low': '14°'},
            {'day': 'In 3 Days', 'emoji': '🌧️', 'high': '21°', 'low': '13°'},
            {'day': 'In 4 Days', 'emoji': '🌩️', 'high': '20°', 'low': '12°'},
            {'day': 'In 5 Days', 'emoji': '⛅️', 'high': '24°', 'low': '14°'},
            {'day': 'In 6 Days', 'emoji': '☀️', 'high': '27°', 'low': '16°'},
        ]
        return jsonify(mock_weather), 200
        
    # --- Serve React App ---
    @app.route('/')
    def index():
        """Serves the main HTML page that loads the React app."""
        return render_template('index.html')

    return app

# --- Run the App ---
if __name__ == '__main__':
    app = create_app()
    # Ensure the 'instance' folder exists for the database
    instance_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance')
    os.makedirs(instance_path, exist_ok=True)
    
    app.run(debug=True, host='127.0.0.1', port=5000)
