<template>
  <div class="flex flex-col gap-5 items-center justify-center mt-10">
    <div class="flex gap-6 items-center mb-4">
      <Dropdown v-model="category_id" :options="categoryOptions" optionLabel="label" optionValue="value" placeholder="Category" class="w-40" />
      <button class="bg-blue-900 text-white px-4 py-1 rounded-full hover:bg-blue-600" @click="showAddDialog = true"><i class="pi pi-plus"> </i></button>
    </div>
    <Dialog v-model:visible="showAddDialog" modal header="Add Task" :style="{ width: '400px' }">
      <Form :validation-schema="taskSchema" @submit="addTask" >
        <div class="flex flex-col gap-3">
          <Field name="title" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="title">Title</label>
            <input v-bind="field" id="title" class="border rounded p-2" placeholder="Title" />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="description" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="description">Description</label>
            <textarea v-bind="field" id="description" class="border rounded p-2" placeholder="Description"></textarea>
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="priority" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="priority">Priority</label>
            <Dropdown v-bind="field" :options="priorityOptions" optionLabel="label" optionValue="value" id="priority" placeholder="Priority" class="w-full" />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="category_id" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="category_id">Category</label>
            <Dropdown v-bind="field" :options="categoryOptions" optionLabel="label" optionValue="value" id="category_id" placeholder="Category" class="w-full" />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="due_date" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="due_date">Due Date</label>
            <input v-bind="field" id="due_date" type="date" class="border rounded p-2" placeholder="Due Date" />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="image_url" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="image_url">Image URL</label>
            <input v-bind="field" id="image_url" class="border rounded p-2" placeholder="Image URL" />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-1 rounded bg-gray-200" @click="showAddDialog = false">Cancel</button>
          <button type="submit" class="px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-600">Add</button>
        </div>
      </Form>
    </Dialog>
  <TaskCard v-for="task in data" :key="task.id" :task="task" class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto bg-white" @delete-task="deleteTask" @card-click="goToTaskDetail" style="cursor:pointer;" />
    <Paginator :rows="limit" :totalRecords="totalRecords" :first="offset" @page="onPage" :rowsPerPageOptions="[10,20,50]" class="mt-4" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useRouter } from 'vue-router';
import { apiFetch, setLoadingCallback } from "../utils/fetchClient"
import TaskCard from './TaskCard.vue';
import Paginator from 'primevue/paginator';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import { Form, Field } from "vee-validate";
import * as yup from 'yup';


const router = useRouter();

const data = ref([])
const error = ref(null)
const loading = ref(false)
const totalRecords = ref(0)
const limit = ref(20)
const offset = ref(0)
const category_id = ref(1)
const completed = ref(false)
const priority = ref('high')
const showAddDialog = ref(false)
const newTask = ref({
  title: '',
  description: '',
  priority: '',
  category_id: null,
  due_date: '',
  image_url: ''
})
const categoryOptions = ref([])
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const taskSchema = yup.object({
  title: yup.string().required('Title is required').max(255, 'Max 255 characters'),
  description: yup.string().nullable(),
  priority: yup.object().required('Priority is required'),
  category_id: yup.object().required('Category is required'),
  due_date: yup.string().required('Due date is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  image_url: yup.string().max(500, 'Max 500 characters').nullable(),
});

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
    console.log("totalRecords:", totalRecords.value);
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
  console.log("Page Event:", event);
  offset.value = event.first
  limit.value = event.rows
  loadTasks()
}

function goToTaskDetail(id) {
  router.push({ path: `/task/${id}` });
}

async function addTask(values) {
  console.log("Form Values:", values);
  try {
    const body = {
      title: values.title,
      description: values.description,
      priority: values.priority.value,
      category_id: values.category_id.value,
      due_date: values.due_date,
      image_url: values.image_url
    };
    console.log("Request Body:", body);
    await apiFetch('tasks', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    showAddDialog.value = false;
    await loadTasks();
  } catch (err) {
    error.value = err.message || 'Failed to add task';
  }
}

onMounted(() => {
  loadCategories()
  loadTasks()
})

watch([limit, offset, category_id, completed, priority], loadTasks)
</script>

<style scoped></style>