from django.urls import path
from . import views

app_name = "general"
urlpatterns  = [
    path('', views.index, name = "index"),
    path('summary', views.summary, name="summary"),
    path('answer', views.answer, name="answer")
]