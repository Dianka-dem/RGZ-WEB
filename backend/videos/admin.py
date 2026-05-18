from django.contrib import admin
from .models import Video, VideoLike, Comment

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'user', 'views', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['title', 'description']
    list_editable = ['views']

@admin.register(VideoLike)
class VideoLikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'video', 'created_at']
    list_filter = ['created_at']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'video', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['text']
