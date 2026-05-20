from django.db import models
from django.contrib.auth.models import User

class Video(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    video_file = models.FileField(upload_to='videos/', verbose_name='Видеофайл')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True, verbose_name='Превью')
    duration = models.IntegerField(default=0, verbose_name='Длительность (сек)')
    views = models.IntegerField(default=0, verbose_name='Просмотры')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos', verbose_name='Пользователь')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class VideoLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'video']
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    video = models.ForeignKey('Video', on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(verbose_name='Текст комментария')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user.username}: {self.text[:50]}'
