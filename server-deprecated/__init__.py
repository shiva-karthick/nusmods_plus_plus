from flask import Flask

def create_app():
    # Create the Flask app
    app = Flask(__name__)

    from .app import main
    app.register_blueprint(main)

    return app