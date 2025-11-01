from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

# --- Extensions Init (No app) ---
# We create the extension instances here, without an app
# Both app.py and models.py will import from this file.
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

