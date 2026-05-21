from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Video, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at', 'user', 'username', 'video']
        read_only_fields = ['user', 'created_at']

class VideoSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'created_at', 'views', 'user', 'username', 'comments']
