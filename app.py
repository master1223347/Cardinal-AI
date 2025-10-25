from flask import Flask, render_template, request, jsonify
import openai
import base64
import io
import pyttsx3
from werkzeug.utils import secure_filename

app = Flask(__name__)
openai.api_key = 'your-openai-key-here'  # Replace with your actual key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Read file into bytes
    image_bytes = file.read()
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    image_data = {"url": f"data:image/jpeg;base64,{base64_image}"}

    # Call OpenAI
    chat_response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Identify the objects in this image."},
                    {"type": "image_url", "image_url": image_data}
                ]
            }
        ],
        max_tokens=500,
    )

    output_text = chat_response.choices[0].message.content

    # TTS
    engine = pyttsx3.init()
    engine.setProperty('rate', 100)
    engine.say(output_text)
    engine.runAndWait()

    return jsonify({'result': output_text})

if __name__ == '__main__':
    app.run(debug=True)