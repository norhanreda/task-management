

<template>
  <div class="flex flex-col gap-5 items-center justify-center mt-10">
    <span class="flex flex-col gap-5 items-center justify-center relative ">
      <i class="pi pi-search absolute right-2 top-3" />
      <input  class="rounded-md border p-2 mb-4 " placeholder="Search" />
    </span>
    <TaskCard class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto bg-white"  />
    
    

   
  </div>
</template>

<style scoped></style>
<script setup>
import { ref, onMounted } from "vue"
import { apiFetch, setLoadingCallback } from "../utils/fetchClient"
import TaskCard from './TaskCard.vue';
const data = ref(null)
const error = ref(null)
const loading = ref(false)

// Subscribe to global loading events
setLoadingCallback((state) => {
  loading.value = state
})

async function loadTasks() {
  error.value = null
  try {
    data.value = await apiFetch("tasks?order=created_at.desc")
    console.log(data.value)
  } catch (err) {
    error.value = err.message || "Failed to load tasks"
  }
}

onMounted(() => {
  loadTasks()
})
</script>