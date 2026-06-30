from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import *
from django.contrib.auth.hashers import make_password, check_password


import random

@api_view(['GET']) 
def get_tags(request):
    if request.method == "GET":
        tags = Tag.objects.all()
        serialized = TagSerializer(tags, many=True).data
        return Response(serialized)

@api_view(['GET', 'POST']) 
def get_notes(request):
    if request.method == "GET":
        notes = Note.objects.all()
        serialized = NoteSerializer(notes, many=True).data
        return Response(serialized)
    elif request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST']) 
def get_note_by_id(request, pk):
    if request.method == "GET":
        notes = Note.objects.filter(id=pk)
        serialized = NoteSerializer(notes, many=True).data
        return Response(serialized)

@api_view(['GET', 'POST']) 
def get_note_random(request):
    if request.method == "GET":
        pk = random.randint(1, Note.objects.count())
        notes = Note.objects.filter(id=pk)
        serialized = NoteSerializer(notes, many=True).data
        return Response(serialized)

@api_view(['GET']) 
def get_notes_writed_by_me(request, pk):
    if request.method == "GET":
        notes = Note.objects.filter(account = pk)
        serialized = NoteSerializer(notes, many=True).data
        return Response(serialized)
    

@api_view(['POST'])
def create_account(request):
    data = request.data

    required_fields = [
        'login',
        'password',
        'name'
    ]

    for field in required_fields:
        if field not in data:
            return Response(
                {"error": f"Field '{field}' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

    login = str(data['login']).strip()
    password = str(data['password'])
    name = str(data['name']).strip()

    if len(login) < 3:
        return Response(
            {"error": "Login must contain at least 3 characters"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 6:
        return Response(
            {"error": "Password must contain at least 6 characters"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if Account.objects.filter(login=login).exists():
        return Response(
            {"error": "Login already exists"},
            status=status.HTTP_409_CONFLICT
        )

    account = Account.objects.create(
        login=login,
        password=make_password(password),
        name=name
    )

    return Response(
        {
            "success": True,
            "account": {
                "id": account.id,
                "login": account.login,
                "name": account.name
            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def login_account(request):
    data = request.data

    required_fields = [
        'login',
        'password'
    ]

    for field in required_fields:
        if field not in data:
            return Response(
                {"error": f"Field '{field}' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

    login = str(data['login']).strip()
    password = str(data['password'])

    try:
        account = Account.objects.get(login=login)
    except Account.DoesNotExist:
        return Response(
            {"error": "Invalid login or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not check_password(password, account.password):
        return Response(
            {"error": "Invalid login or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(
        {
            "success": True,
            "accaunt": {
                "id": account.id,
                "login": account.login,
                "name": account.name
            }
        },
        status=status.HTTP_200_OK
    )