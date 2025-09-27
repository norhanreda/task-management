<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["delete-task"]);
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto bg-white">
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl text-blue-900 font-bold">{{ props.task.title }}</h1>
      <button
        class="ml-2 text-red-600 hover:text-red-800 cursor-pointer"
        title="Delete"
        @click.stop="emit('delete-task', props.task.id)"
      >
        <i class="pi pi-trash" style="font-size: 1.3em"></i>
      </button>
    </div>

    <p class="mb-2 text-gray-700">
      {{ props.task.description.substring(0, 30) }} ...
    </p>
  </div>
</template>

<style scoped></style>
