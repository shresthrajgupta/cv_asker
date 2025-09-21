from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Question, Skill

from ..utils import generate_question

# fmt: off
class GenerateQuestionsView(APIView):
    def post(self, request):
        skill = request.data.get("skill")
        proficiency = request.data.get("proficiency")

        if not skill or not proficiency:
            return Response(
                {"error": "Both 'skill' and 'proficiency' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        skill_obj = get_object_or_404(Skill, name=skill, proficiency=proficiency)
        if not skill_obj:
            return Response({"error": "skill not found in db"})

        try:
            ai_questions = generate_question(skill, proficiency)
        except Exception as e:
            return Response({"error": "error generating questions, please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # created_objs = []

        for item in ai_questions:
            if len(item) != 6:
                return Response({"error": "incorrect format of question array"})

            q_text, opt_a, opt_b, opt_c, opt_d, correct = item
            correct = correct.upper()

            obj = Question.objects.create(
                skill=skill_obj,
                question=q_text,
                option_a=opt_a,
                option_b=opt_b,
                option_c=opt_c,
                option_d=opt_d,
                correct_ans=correct,
                difficulty=proficiency,
            )
            # created_objs.append(obj)

        return Response({"data": {"message": f"questions stored successfully for {skill}"}}, status=status.HTTP_201_CREATED)
