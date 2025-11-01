import os
from flask import Flask, jsonify, request, render_template, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required

# --- Import Extensions ---
# Import from the extensions.py file
from extensions import db, bcrypt, login_manager

# --- App Setup ---
app = Flask(__name__)
# Configure secret key and database URI
app.config['SECRET_KEY'] = 'a_very_secret_key_that_should_be_changed'
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'farm.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- Init Apps ---
# Connect the app to the extensions
db.init_app(app)
bcrypt.init_app(app)
login_manager.init_app(app)

login_manager.login_view = 'api_unauthorized' # Will send a 401 response

# --- CRITICAL FIX ---
# Import the models *after* db.init_app(app) has been called.
# This ensures that db.Model has the correct app context when models.py is loaded.
from models import User, SlimmyZone

# --- User Loader for Flask-Login ---
@login_manager.user_loader
def load_user(user_id):
    # No import needed, User is already imported
    return User.query.get(int(user_id))

# --- Helper to create default map data for a new user ---
def create_default_map_data(user_id):
    # No import needed
    zones = []
    zone_lengths = {'tomatoes': 5, 'onions': 6, 'mint': 4}
    for plant_type, length in zone_lengths.items():
        for i in range(length):
            zone = SlimmyZone(
                owner_id=user_id,
                plant_type=plant_type,
                zone_index=i,
                soil_needs_water=bool(i % 2), # Default pattern
                pump_is_on=False
            )
            zones.append(zone)
    db.session.bulk_save_objects(zones)
    db.session.commit()

# --- Main Route (Serves the React App) ---
@app.route('/')
def index():
    # This route serves the single-page application shell
    return render_template('index.html')

# --- API Routes ---

# [AUTH API]
@app.route('/api/signup', methods=['POST'])
def api_signup():
    # No import needed
    data = request.json
    username = data.get('username')
    cin = data.get('cin')
    password = data.get('password')

    if not all([username, cin, password]):
        return jsonify({"error": "Missing data"}), 400
    
    if len(cin) != 8:
        return jsonify({"error": "CIN must be 8 digits"}), 400

    if User.query.filter_by(cin=cin).first():
        return jsonify({"error": "CIN already registered"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, cin=cin, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Create default map data for the new user
    create_default_map_data(new_user.id)

    login_user(new_user, remember=True)
    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "cin": new_user.cin
    }), 201

@app.route('/api/login', methods=['POST'])
def api_login():
    # No import needed
    data = request.json
    cin = data.get('cin')
    password = data.get('password')

    user = User.query.filter_by(cin=cin).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user, remember=True)
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
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/session', methods=['GET'])
def api_session():
    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "username": current_user.username,
            "cin": current_user.cin
        }), 200
    return jsonify({"error": "No active session"}), 401

@login_manager.unauthorized_handler
def api_unauthorized():
    # This function is called when a user tries to access an @login_required route
    # without being logged in.
    return jsonify({"error": "Not authorized"}), 401

# [DATA API]
@app.route('/api/map_data', methods=['GET'])
@login_required
def api_map_data():
    # No import needed
    zones = SlimmyZone.query.filter_by(owner_id=current_user.id).all()
    
    # Check if user has data, if not, create it
    if not zones:
        create_default_map_data(current_user.id)
        zones = SlimmyZone.query.filter_by(owner_id=current_user.id).all()

    # Format data for the React app
    map_data = {
        "soil": {"tomatoes": [], "onions": [], "mint": []},
        "pumps": {"tomatoes": [], "onions": [], "mint": []}
    }
    
    for zone in sorted(zones, key=lambda z: z.zone_index):
        if zone.plant_type in map_data["soil"]:
            map_data["soil"][zone.plant_type].append(zone.soil_needs_water)
            map_data["pumps"][zone.plant_type].append(zone.pump_is_on)
            
    return jsonify(map_data), 200

@app.route('/api/update_soil', methods=['POST'])
@login_required
def api_update_soil():
    # No import needed
    data = request.json
    plant_type = data.get('plant_type')
    zone_index = data.get('zone_index')
    new_state = data.get('new_state')

    zone = SlimmyZone.query.filter_by(
        owner_id=current_user.id,
        plant_type=plant_type,
        zone_index=zone_index
    ).first()

    if zone:
        zone.soil_needs_water = new_state
        db.session.commit()
        return jsonify({"message": "Soil updated"}), 200
    return jsonify({"error": "Zone not found"}), 404

@app.route('/api/update_pump', methods=['POST'])
@login_required
def api_update_pump():
    # No import needed
    data = request.json
    plant_type = data.get('plant_type')
    zone_index = data.get('zone_index')
    new_state = data.get('new_state')

    zone = SlimmyZone.query.filter_by(
        owner_id=current_user.id,
        plant_type=plant_type,
        zone_index=zone_index
    ).first()

    if zone:
        zone.pump_is_on = new_state
        db.session.commit()
        return jsonify({"message": "Pump updated"}), 200
    return jsonify({"error": "Zone not found"}), 404

@app.route('/api/weather', methods=['GET'])
@login_required
def api_weather():
    # Return mock data as before. A real app would fetch this from a service.
    forecast_data = [
        { "day": 'Today', "emoji": '☀️', "high": '28°', "low": '16°' },
        { "day": 'Tomorrow', "emoji": '⛅️', "high": '26°', "low": '15°' },
        { "day": 'In 2 Days', "emoji": '🌧️', "high": '22°', "low": '14°' },
        { "day": 'In 3 Days', "emoji": '🌧️', "high": '21°', "low": '13°' },
        { "day": 'In 4 Days', "emoji": '🌩️', "high": '20°', "low": '12°' },
        { "day": 'In 5 Days', "emoji": '⛅️', "high": '24°', "low": '14°' },
        { "day": 'In 6 Days', "emoji": '☀️', "high": '27°', "low": '16°' },
    ]
    return jsonify(forecast_data), 200

# --- Create DB and Run App ---
if __name__ == '__main__':
    # Create an 'instance' directory for the DB if it doesn't exist
    instance_dir = os.path.join(basedir, 'instance')
    if not os.path.exists(instance_dir):
        os.makedirs(instance_dir)
        
    with app.app_context():
        db.create_all() # Create database tables if they don't exist
        
    app.run(debug=True)

