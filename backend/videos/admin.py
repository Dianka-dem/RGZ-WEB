from django.contrib import admin
from .models import Video, VideoLike

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'user', 'views', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['title', 'description']

@admin.register(VideoLike)
class VideoLikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'video', 'created_at']