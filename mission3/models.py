from extensions import db
from flask_login import UserMixin

# --- User Model ---
# This model stores the authentication data in the SQLite database.
# The SlimmyZone data is no longer here; it's in map_data.json.

class User(db.Model, UserMixin):
    """
    User model for authentication.
    Stores user's ID, username, 8-digit CIN, and hashed password.
    """
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    cin = db.Column(db.String(8), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

