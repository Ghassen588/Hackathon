from extensions import db  # Import db from the new extensions.py
from flask_login import UserMixin 

# --- User Model ---
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    cin = db.Column(db.String(8), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    zones = db.relationship('SlimmyZone', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

# --- Map Data Model ---
class SlimmyZone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plant_type = db.Column(db.String(50), nullable=False) # 'tomatoes', 'onions', 'mint'
    zone_index = db.Column(db.Integer, nullable=False) # 0, 1, 2, 3, etc.
    soil_needs_water = db.Column(db.Boolean, default=False, nullable=False)
    pump_is_on = db.Column(db.Boolean, default=False, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Zone {self.plant_type}-{self.zone_index}>'

