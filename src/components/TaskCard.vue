<script setup>
import { ref } from "vue";
import { defineEmits } from "vue";
import Dialog from "primevue/dialog";

const emit = defineEmits(["delete-task"]);
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const showDeleteDialog = ref(false);

function openDeleteDialog() {
  showDeleteDialog.value = true;
}

function handleDelete() {
  emit('delete-task', props.task.id);
  showDeleteDialog.value = false;
}

function handleCancel() {
  showDeleteDialog.value = false;
}
</script>

<template>
  <Dialog v-model:visible="showDeleteDialog" modal header="Delete Confirmation" :style="{ width: '350px' }">
    <div class="flex flex-col items-center gap-4 p-4">
      <i class="pi pi-exclamation-triangle text-3xl text-red-600"></i>
      <span class="text-lg">Are you sure you want to delete this task?</span>
      <div class="flex gap-4 justify-center mt-4">
        <button class="px-4 py-1 rounded bg-gray-200" @click="handleCancel">No</button>
        <button class="px-4 py-1 rounded bg-red-600 text-white" @click="handleDelete">Yes</button>
      </div>
    </div>
  </Dialog>
  <div class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto bg-white" @click="$emit('card-click', props.task.id)" style="cursor:pointer;">
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl text-blue-900 font-bold">{{ props.task.title }}</h1>
      <button
        class="ml-2 text-red-600 hover:text-red-800 cursor-pointer"
        title="Delete"
        @click.stop="openDeleteDialog"
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
