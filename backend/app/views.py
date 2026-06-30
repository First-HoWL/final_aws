from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import *



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