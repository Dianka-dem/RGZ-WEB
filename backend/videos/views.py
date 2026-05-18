from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.http import HttpResponse, FileResponse, Http404
from django.shortcuts import get_object_or_404
import os

from .models import Video, VideoLike, Comment
from .serializers import VideoSerializer, VideoUploadSerializer, UserSerializer, RegisterSerializer, CommentSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    pass

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'stream_video']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return VideoUploadSerializer
        return VideoSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = Video.objects.all()
        serializer = VideoSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        like, created = VideoLike.objects.get_or_create(user=request.user, video=video)
        if not created:
            like.delete()
            return Response({'status': 'unliked', 'likes_count': video.likes.count()})
        return Response({'status': 'liked', 'likes_count': video.likes.count()})
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        video = self.get_object()
        video.views += 1
        video.save()
        return Response({'views': video.views})
    
    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        video = self.get_object()
        
        if request.method == 'GET':
            comments = video.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            if not request.user.is_authenticated:
                return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                comment = Comment.objects.create(
                    user=request.user,
                    video=video,
                    text=serializer.validated_data['text']
                )
                return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def stream_video(self, request, pk=None):
        video = get_object_or_404(Video, pk=pk)
        video_path = video.video_file.path
        
        if not os.path.exists(video_path):
            raise Http404("File not found")
        
        range_header = request.headers.get('Range', None)
        file_size = os.path.getsize(video_path)
        
        if range_header:
            byte_range = range_header.replace('bytes=', '').split('-')
            start = int(byte_range[0])
            end = int(byte_range[1]) if byte_range[1] else file_size - 1
            
            def generate_chunks():
                with open(video_path, 'rb') as f:
                    f.seek(start)
                    remaining = end - start + 1
                    chunk_size = 1024 * 1024
                    while remaining > 0:
                        chunk = f.read(min(chunk_size, remaining))
                        if not chunk:
                            break
                        yield chunk
                        remaining -= len(chunk)
            
            response = HttpResponse(generate_chunks(), status=206, content_type='video/mp4')
            response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
            response['Accept-Ranges'] = 'bytes'
            response['Content-Length'] = str(end - start + 1)
        else:
            response = FileResponse(open(video_path, 'rb'), content_type='video/mp4')
            response['Accept-Ranges'] = 'bytes'
        
        return response
