import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MoviesView from '../views/MoviesView.vue'
import ActorsView from '../views/ActorsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import DetailMoviesView from '../views/DetailMoviesView.vue'
import DetailActorsView from '../views/DetailActorsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movies',
      name: 'movies',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MoviesView
    },
    {
      path: '/movie/:id',
      name: 'detailmovie',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: DetailMoviesView
    },
    {
      path: '/actors',
      name: 'actor',
      component: ActorsView
    },
    {
      path: '/actor/:id',
      name: 'detailactor',
      component: DetailActorsView
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    }
  ]
})

export default router
