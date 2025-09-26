<template>
  <div class="flex flex-col gap-5 items-center justify-center mt-10">
    <div class="flex gap-6 items-center mb-4">
      <Dropdown v-model="category_id" :options="categoryOptions" optionLabel="label" optionValue="value" placeholder="Category" class="w-40" />
      <button class="bg-blue-900 text-white px-4 py-1 rounded-full hover:bg-blue-600"><i class="pi pi-plus"> </i></button>
    </div>
    <TaskCard v-for="task in data" :key="task.id" :task="task" class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto bg-white" @delete-task="deleteTask" />
    <Paginator :rows="limit" :totalRecords="totalRecords" :first="offset" @page="onPage" :rowsPerPageOptions="[10,20,50]" class="mt-4" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { apiFetch, setLoadingCallback } from "../utils/fetchClient"
import TaskCard from './TaskCard.vue';
import Paginator from 'primevue/paginator';
import Dropdown from 'primevue/dropdown';

const data = ref([])
const error = ref(null)
const loading = ref(false)
const totalRecords = ref(0)
const limit = ref(20)
const offset = ref(0)
const category_id = ref(1)
const completed = ref(false)
const priority = ref('high')

const categoryOptions = ref([])

async function loadCategories() {
  try {
    const categories = await apiFetch('categories?order=name.asc')
  
    categoryOptions.value = (categories.data || categories).map(cat => ({
      label: cat.name,
      value: cat.id
    }))
  } catch (err) {
    categoryOptions.value = []
  }
}

setLoadingCallback((state) => {
  loading.value = state
})

async function loadTasks() {
  error.value = null
  try {

    const params = [
      `limit=${limit.value}`,
      `offset=${offset.value}`,
      `category_id=eq.${category_id.value}`,
      // `completed=eq.${completed.value}`,
      // `priority=eq.${priority.value}`,
      // 'order=created_at.desc'
    ].join('&')
    const response = await apiFetch(`tasks?${params}`)
    data.value = response.data || response 
    totalRecords.value = response.count || 100 
  } catch (err) {
    error.value = err.message || "Failed to load tasks"
  }
}

async function deleteTask(taskId) {
  try {
    await apiFetch(`tasks?id=eq.${taskId}`, { method: 'DELETE' })
    await loadTasks()
  } catch (err) {
    error.value = err.message || 'Failed to delete task'
  }
}

function onPage(event) {
  offset.value = event.first
  limit.value = event.rows
  loadTasks()
}

onMounted(() => {
  loadCategories()
  loadTasks()
})

watch([limit, offset, category_id, completed, priority], loadTasks)
</script>

<style scoped></style>