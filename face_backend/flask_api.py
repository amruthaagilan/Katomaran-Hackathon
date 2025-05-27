from flask import Flask, request, jsonify
from register import register_face  # Your face registration function
from recognizer import recognize_faces  # Your face recognition function

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    image_path = data.get('image_path')

    if not name or not image_path:
        return jsonify({"error": "Missing 'name' or 'image_path'"}), 400

    try:
        success = register_face(image_path, name)
        if success:
            return jsonify({"message": "Face registered successfully"})
        else:
            return jsonify({"error": "Registration failed"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recognize', methods=['POST'])
def recognize():
    # Expecting multipart/form-data with image file
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']
    image_path = f"uploads/{image.filename}"
    image.save(image_path)

    try:
        results = recognize_faces(image_path)
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
