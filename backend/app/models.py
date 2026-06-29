from django.db import models

# Create your models here.

class Account(models.Model):
    login = models.CharField(unique=True)
    password = models.CharField()
    name = models.CharField()

    def __str__(self):
        return f"[{self.id}] {self.name} ({self.login})"
    
class Tag(models.Model):
    name = models.CharField()

    def __str__(self):
        return f"[{self.id}] {self.name} "

class Note(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "На проверке"
        PUBLISHED = "PUBLISHED", "Опубликовано"
        REJECTED = "REJECTED", "Отклонено"

    
    text = models.TextField()
    title = models.TextField()
    isAnonimuous = models.BooleanField()
    likes = models.IntegerField()
    views = models.IntegerField()
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    date = models.DateTimeField(auto_now_add=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, through='NoteTags')
    
    def __str__(self):
        return f"[{self.id}] {self.title} by [{self.account.id}] ({self.account.name})"

class NoteTags(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self):
        return f"[{self.id}] note({self.note.id}) tag({self.tag.id})"