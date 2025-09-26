<script setup>
import TaskDetail from "./components/TaskDetail.vue";
import AllTasks from "./components/AllTasks.vue";
</script>

<template>
  <div>
    <h1 class="text-2xl p-8 text-blue-900 font-bold">Task Manager</h1>

    <TaskDetail v-if="false" />
    <AllTasks v-else />

    
  </div>
</template>

<style scoped></style>
