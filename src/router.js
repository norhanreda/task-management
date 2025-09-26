import { createRouter, createWebHistory } from 'vue-router';
import AllTasks from './components/AllTasks.vue';
import TaskDetail from './components/TaskDetail.vue';

const routes = [
  { path: '/', component: AllTasks },
  { path: '/task/:id', component: TaskDetail, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
