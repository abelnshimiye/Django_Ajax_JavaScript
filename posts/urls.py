from django.urls import path 
from .views import (
    post_list_and_create,
    load_data_view,
    like_unlike_post,
    post_detail,
    post_detail_data_view,
    delete_post,
    update_post,
    image_upload_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    path('upload/', image_upload_view, name='image-upload'),
    path ('<pk>/', post_detail, name='post-detail'),
    path ('<pk>/delete/', delete_post, name='post-delete'),
    path ('<pk>/update/', update_post, name='post-update'),
    path('data/<int:num_posts>', load_data_view, name='data'),
    path('<pk>/data/', post_detail_data_view, name='post-detail-data'),
    
]