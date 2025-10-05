from django.urls import path
from . import views

urlpatterns = [
    path("exoplanets", views.exoplanets_in_view),
    path("exoplanet/info", views.get_exoplanet_data),
]