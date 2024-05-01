from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)


# Set your OpenAI API key here
openai.api_key = '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'
user_answers = []


# @app.route('/generateQuestions', methods=['POST'])
# def generate_questions():
#     data = request.json
#     topic = data.get('topic')

#     try:
#         questions = []

#         # Generate 10 different questions
#         for i in range(3):
#             response = openai.ChatCompletion.create(
#                 model="gpt-3.5-turbo",
#                 messages=[
#                     {"role": "system", "content": "You are a helpful assistant."},
#                     {"role": "user", "content": f"Based on the user's answer of last question to asking them once a time, if they type no detailed, ask them to give more details no more than 2 times,Generate a UX interview question about: {topic}"},
#                 ],
#                 # max_tokens=100,
#                 temperature=0.7
#             )
#             main_question = response.choices[0].message.content.strip()

#             # Generate 4 similar questions for each main question
#             similar_questions = [main_question]
#             for j in range(3):
#                 similar_response = openai.ChatCompletion.create(
#                     model="gpt-3.5-turbo",
#                     messages=[
#                         {"role": "system", "content": "You are a helpful assistant."},
#                         {"role": "user", "content": f"Generate a similar question to: {main_question}"},
#                     ],
#                     # max_tokens=100,
#                     temperature=0.7
#                 )
#                 similar_questions.append(similar_response.choices[0].message.content.strip())

#             questions.append(similar_questions)

#         return jsonify({'questions': questions})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
@app.route('/generateQuestions', methods=['POST'])
def generate_questions():
    data = request.json
    topic = data.get('topic')
    topicData = data.get('topicData')
    background = data.get('background')
    backgroundFile = data.get('backgroundFile')
    keyQuestions = data.get('keyQuestions')
    last_answer = data.get('last_answer')  # Get the last answer from the user
    ask_for_details = data.get('ask_for_details', False) 

    try:
        questions = []
        for _ in range(3):  # Generate 3 similar questions
            if last_answer and ask_for_details:
                # If the last answer is provided and not detailed enough, ask for more details
                message = f"The user's last answer was: \"{last_answer}\". It seems brief. Could you ask a follow-up question to get more details? the question should only contain content without any additional text or explanation."
            else:
                # Generate a new UX interview question
                message = f"Generate a UX interview simplified question without additional words base on the following doucuments: {topicData}"

            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message},
                ],
                temperature=0.7
            )
            question = response.choices[0].message.content.strip()
            questions.append(question)

        return jsonify({'questions': questions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/analyzeSentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    text = data.get('text')
    user_answers.append(text)

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Use number range from 0.10 to 2.00 to evaluate the user's sentiment more positive more higher, more negative more lower,for example,love is 1.80, hate is 0.10, dislike is 0.25, like is 1.02, only show number value,The following text: \"{text}\" expresses a sentiment number that is:"},
            ],
            temperature=0.0
        )
        sentiment = response.choices[0].message.content.strip()
        return jsonify({'sentiment': sentiment})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/extractKeywords', methods=['POST'])
def extract_keywords():
    data = request.json
    answer = data.get('answer')
    user_answers.append(answer)

    try:
        response = openai.chat.completions.create(
           model="gpt-3.5-turbo",
              messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Extract 5 keywords only words for analysing characteristic features from the following text: {answer}"},
              ],
              # max_tokens=100,
              temperature=0.3
        )
        # Assuming the response returns a newline-separated string of keywords prefixed with numbers.
        keyword_string = response.choices[0].message.content.strip()
        # Split the string by newlines and then by the period to extract just the keyword
        keywords = [kw.strip().split('. ')[1] for kw in keyword_string.split('\n') if '. ' in kw]
        return jsonify({'keywords': keywords})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/generatePriorityMatrix', methods=['POST'])
def generate_priority_matrix():
    data = request.json
    print("Received data:", data)  # 打印接收到的数据
    text = data.get('text', [])
    combined_answers = " ".join(text)
    print("Current user_answers:", combined_answers)  


    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Generate a standard structured JSON object representing an priority matrix based on the user's answers: {combined_answers}. The JSON should contain the four categories ('Urgent and Important', 'Important but Not Urgent', 'Urgent but Not Important', 'Not Urgent and Not Important') and the associated tasks for each category. without any additional text or explanation."},
            ],
            temperature=0.5
        )
        priority_matrix = response.choices[0].message.content.strip()
           # Parse the priority matrix string into a JSON object
        priority_matrix_json = json.loads(priority_matrix)
        print("Cleaned Priority Matirx JSON:", priority_matrix_json)

        return jsonify({'priorityMatrix': priority_matrix_json})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Generate affinity diagram
@app.route('/generateAffinityDiagram', methods=['POST'])
def generate_affinity_diagram():
    data = request.get_json()
    if not data or 'text' not in data or not isinstance(data['text'], list):
        return jsonify({'error': 'Invalid input format'}), 400

    user_answers = data['text']
    combined_answers = " ".join(user_answers)
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Generate a JSON object representing an affinity diagram based on the user's answers: {combined_answers}. The JSON should have the following format: {{'affinity_diagram': {{'Categories': [{{'Category': 'Category Name', 'Points': ['Point 1', 'Point 2', '...']}}]}}}}."},
            ],
            temperature=0.5
        )
        affinity_diagram_json = response.choices[0].message.content.strip().replace("```json\n", "").replace("\n```", "")
        print("Cleaned Affinity Diagram JSON:", affinity_diagram_json)

        # Now try parsing the cleaned JSON string
        affinity_diagram = json.loads(affinity_diagram_json)
        return jsonify(affinity_diagram)
    except json.JSONDecodeError as json_error:
        print("JSON decoding error:", json_error)
        return jsonify({'error': 'JSON decoding error', 'details': str(json_error)}), 500
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({'error': str(e)}), 500
    

@app.route('/summarizeAnswers', methods=['POST'])
def summarize_answers():
    data = request.json
    initial = data.get('text')
    if not isinstance(initial, list):
        return jsonify({'error': 'Expected a list of text strings'}), 400
    combined_text = " ".join(initial)

    try:
        response = openai.chat.completions.create(
           model="gpt-3.5-turbo",
              messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Analysis his answers and summarize his pinpoints in UX perspective : {combined_text},just return your pespective in json format"},
              ],
              max_tokens=150,
              temperature=0.5
        )
        summary  = response.choices[0].message.content.strip()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/generategreetings', methods=['POST'])
def generate_greetings():
    data = request.json
    personalInfo = data.get('personalInfo')

    try:
        response = openai.chat.completions.create(
           model="gpt-3.5-turbo",
              messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"base on his text: {personalInfo}, guess his name and show greating to him and tell our goal is for UX research,just need to show your results,don't need to show how to guess"},
              ],
              max_tokens=105,
              temperature=0.5
        )
        personalInfo = response.choices[0].message.content.strip()
        print("personalInfo:", personalInfo)

        return jsonify({'personalInfo': personalInfo})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/generateComparisonData', methods=['POST'])
def generate_comparison_data():
    data = request.json
    answers = data.get('text', [])

    # Count the occurrences of each answer
    answer_counts = {}
    for answer in answers:
        if answer in answer_counts:
            answer_counts[answer] += 1
        else:
            answer_counts[answer] = 1

    # Convert the answer counts to the expected format
    insights = [{"question": answer, "answerCount": count} for answer, count in answer_counts.items()]

    return jsonify({'insights': insights})


@app.route('/getSurveyStats', methods=['GET'])
def get_survey_stats():
    # Your logic here to get real-time stats, for example:
    stats = {
        'surveysSent': 60,
        'responsesReceived': 42,
        'responsesPending': 18,
        'averageTime': '15m 32s',
        'completionRate': '84.2%',
        'lastResponseTime': 'Mar. 22 4:50pm',
        'totalResponses': 94
    }
    return jsonify(stats)

@app.route('/calculateImportanceScores', methods=['POST'])
def calculate_importance_scores():
    data = request.json
    answers = data.get('answers', [])

    def get_gpt_score(answer_text):
        try:
            response = chat.completions.create(
                model="gpt-3.5-turbo",
                prompt=f"Rate the specificity and detail of this answer on a scale from 0 to 100: '{answer_text}'",
                temperature=0,
                max_tokens=10
            )
            result = response.choices[0].text.strip()
            score = float(result)
            return min(max(score, 0), 100)  # Ensure score is between 0 and 100
        except Exception as e:
            print(f"An error occurred while getting GPT score: {e}")
            return 50.0  # Default to a neutral score in case of an error

    scores = [
        {
            'answerIndex': idx + 1,
            'answer': ans,
            'importanceScore': get_gpt_score(ans)
        }
        for idx, ans in enumerate(answers)
    ]

    return jsonify(scores)

if __name__ == '__main__':
    app.run(debug=True)
