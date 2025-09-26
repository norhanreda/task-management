<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['delete-task']);
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="rounded-md shadow-2xl  p-5 w-[60%] flex flex-col m-auto bg-white">
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl text-blue-900 font-bold">{{ props.task.title }}</h1>
      <button class="ml-2 text-red-600 hover:text-red-800 cursor-pointer" title="Delete" @click="emit('delete-task', props.task.id)">
        <i class="pi pi-trash" style="font-size: 1.3em;"></i>
      </button>
    </div>
    <img v-if="props.task.image_url" :src="props.task.image_url" class="w-full max-h-60 object-cover rounded mb-4 mt-6" />
    <p class="mb-2 text-gray-700">{{ props.task.description }}</p>
    <div class="flex flex-wrap gap-4 mb-2">
      <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Priority: {{ props.task.priority }}</span>
      <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed: {{ props.task.completed ? 'Yes' : 'No' }}</span>
      <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Due: {{ props.task.due_date }}</span>
    </div>
  </div>
</template>

<style scoped></style>
