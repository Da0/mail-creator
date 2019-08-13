import Start from '@/components/pages/StartPage'
import Posts from '@/components/pages/PostsPage'
import NewPost from '@/components/pages/NewPostPage'
import EditPost from '@/components/pages/EditPostPage'
import NewBanner from '@/components/pages/NewBannerPage'
import EditBanner from '@/components/pages/EditBannerPage'

const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts
  },
  {
    path: '/posts/new',
    name: 'NewPost',
    component: NewPost
  },
  {
    path: '/posts/:id',
    name: 'EditPost',
    component: EditPost
  },
  {
    path: '/banners/new',
    name: 'NewBanner',
    component: NewBanner
  },
  {
    path: '/banners/:id',
    name: 'EditBanner',
    component: EditBanner
  }
];

export default routes
