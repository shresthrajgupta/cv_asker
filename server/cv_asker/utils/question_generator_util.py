import os
import json
from google import genai


def _call_gemini(gemini_prompt):
    client = genai.Client(api_key=os.environ.get('GEMINI_API'))

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=gemini_prompt
    )

    return response


def generate_question(skill, proficiency):
    gemini_prompt = f'''
                    You are an interviewer. You have been provided skill name and its proficiency level out of 10 by the candidate.
                    You have to ask the candidate 10 questions on the given skill and their proficiency (1 being absolute beginner to 10 being extremenly experienced) in the form of mcq with 4 options.

                    Generate 10 questions in the form of an array containing 10 elements each being in the format [question,option_a,option_b,option_c,option_d,correct option(enum[a,b,c,d])].

                    Do not give anything in response just the desired array in the format provided above.
                    In case your question has new lines and indentations, use \\t and \\n etc accordingly so that it can be formatted while reading.

                    Skill: {skill}, Proficiency (out of 10): {proficiency}
        '''.strip()

    # fmt: off
    response_string = _call_gemini(gemini_prompt)

    response_text = (getattr(response_string, 'text', None) or str(response_string)).strip()

    response = response_text.strip("```json").strip("```")
    response_json = json.loads(response)

    return response_json