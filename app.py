from flask import Flask, request, render_template
import google.generativeai as genai
import pickle

API_KEY = "AIzaSyD24U8fjSUHW4Z7gEvbK29Lsw6rkwovCzA"
genai.configure(api_key=API_KEY)

app = Flask(__name__)

model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

with open('model.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    problem = request.form['problem']
    statement = f'Ignore Grammar mistakes and Find the problem in "{problem}" only in the mental health perspective and tell About the Issue, Self-Help Strategies, and Professional Treatments for it.'
    response = chat.send_message(statement)
    final_solution = response.text

    formatted_solution = final_solution.replace("\n", "<br>").replace("*", "")
    
    return render_template('index.html', problem=formatted_solution)
def predict():
    try:
        data = request.json
        logging.debug(f"Received data: {data}")

        answers = data['answers']
        logging.debug(f"Answers: {answers}")
        
        # Ensure the answers are in the expected format
        prediction = model.predict([answers])
        logging.debug(f"Prediction: {prediction}")
        
        if prediction == [1]:
            result = "No depression"
        elif prediction == [2]:
            result = "Mild"
        elif prediction == [3]:
            result = "Moderate"
        else:
            result = "Severe"
        
        return jsonify({'result': result})
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({'result': 'Error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5891)
