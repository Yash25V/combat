from django.contrib.auth import authenticate
from django.http import JsonResponse
import json

def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )

        if user:
            return JsonResponse({
                "status": "success",
                "role": user.role
            })

        return JsonResponse({"status": "error"})