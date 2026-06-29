from rest_framework import serializers
from .models import *

class AccountSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True)
    login = serializers.CharField(write_only=True)

    class Meta:
        model  = Account
        fields = ['id', 'password', 'login', 'name']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class NoteSerializer(serializers.ModelSerializer):
    account = serializers.SerializerMethodField()
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        source='account',
        write_only=True
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True
    )
    date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Note
        fields = [
            'id',
            'text',
            'title',
            'isAnonimuous',
            'likes',
            'views',
            'date',
            'account',
            'account_id',
            'tags',
            'status'
        ]

    def get_account(self, obj):
        if obj.isAnonimuous:
            return None

        return AccountSerializer(obj.account).data