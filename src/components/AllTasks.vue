<template>
  <Toast ref="toast" />
  <div v-if="loading" class="flex flex-col items-center justify-center mt-10">
    <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" fillColor="#eee" animationDuration="1s" />
    <span class="mt-4 text-blue-700">Loading...</span>
  </div>
  <div v-else class="flex flex-col gap-5 items-center justify-center mt-10">
    <div class="flex gap-6 items-center mb-4">
      <Dropdown
        v-model="category_id"
        :options="categoryOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Category"
        class="w-40"
      />
      <button
        class="bg-blue-900 text-white px-4 py-1 rounded-full hover:bg-blue-600"
        @click="showAddDialog = true"
      >
        <i class="pi pi-plus"> </i>
      </button>
    </div>
    <Dialog
      v-model:visible="showAddDialog"
      modal
      header="Add Task"
      :style="{ width: '400px' }"
    >
      <Form :validation-schema="taskSchema" @submit="addTask">
        <div class="flex flex-col gap-3">
          <Field name="title" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="title">Title</label>
            <input
              v-bind="field"
              id="title"
              class="border rounded p-2"
              placeholder="Title"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="description" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="description"
              >Description</label
            >
            <textarea
              v-bind="field"
              id="description"
              class="border rounded p-2"
              placeholder="Description"
            ></textarea>
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="priority" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="priority"
              >Priority</label
            >
            <Dropdown
              v-bind="field"
              :options="priorityOptions"
              optionLabel="label"
              optionValue="value"
              id="priority"
              placeholder="Priority"
              class="w-full"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="category_id" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="category_id"
              >Category</label
            >
            <Dropdown
              v-bind="field"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              id="category_id"
              placeholder="Category"
              class="w-full"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="due_date" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="due_date"
              >Due Date</label
            >
            <input
              v-bind="field"
              id="due_date"
              type="date"
              class="border rounded p-2"
              placeholder="Due Date"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="image_url" v-slot="{ field, errorMessage }">
            <label class="font-semibold mb-0.5 block" for="image_url"
              >Image URL</label
            >
            <input
              v-bind="field"
              id="image_url"
              class="border rounded p-2"
              placeholder="Image URL"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            class="px-4 py-1 rounded bg-gray-200"
            @click="showAddDialog = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </Form>
    </Dialog>
    <TaskCard
      v-for="task in data"
      :key="task.id"
      :task="task"
      class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto bg-white"
      @delete-task="deleteTask"
      @card-click="goToTaskDetail"
      style="cursor: pointer"
    />
    <Paginator
      :rows="limit"
      :totalRecords="totalRecords"
      :first="offset"
      @page="onPage"
      :rowsPerPageOptions="[10, 20, 50]"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import { ref as vueRef } from 'vue';
const toast = vueRef();
import { ref, onMounted, watch, onActivated } from "vue";
import { useRouter } from "vue-router";
import { setLoadingCallback } from "../utils/fetchClient";
import {
  fetchTasks,
  addTask as addTaskApi,
  deleteTask as deleteTaskApi,
} from "../services/taskService";
import { fetchCategories } from "../services/categoryService";
import TaskCard from "./TaskCard.vue";
import Paginator from "primevue/paginator";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const router = useRouter();

const data = ref([]);
const error = ref(null);
const loading = ref(false);
const totalRecords = ref(0);
const limit = ref(20);
const offset = ref(0);
const category_id = ref(1);

const storedCategoryId = localStorage.getItem("lastCategoryId");
if (storedCategoryId) {
  category_id.value = Number(storedCategoryId);
}

const showAddDialog = ref(false);

const categoryOptions = ref([]);
const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const taskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(255, "Max 255 characters"),
  description: yup.string().nullable(),
  priority: yup.object().nullable(),
  category_id: yup.object().required("Category is required"),
  due_date: yup
    .string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  image_url: yup.string().max(500, "Max 500 characters").nullable(),
});

async function loadCategories() {
  try {
    const categories = await fetchCategories();
    categoryOptions.value = (categories.data || categories).map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));
  } catch (err) {
    categoryOptions.value = [];
  }
}

setLoadingCallback((state) => {
  loading.value = state;
});

async function loadTasks() {
  error.value = null;
  try {
    const params = [
      `limit=${limit.value}`,
      `offset=${offset.value}`,
      `category_id=eq.${category_id.value}`,
      // `completed=eq.${completed.value}`,
      // `priority=eq.${priority.value}`,
      // 'order=created_at.desc'
    ].join("&");
    const response = await fetchTasks(params);
    data.value = response.data || response;
    totalRecords.value = response.count || 100;
    console.log("totalRecords:", totalRecords.value);
  } catch (err) {
    error.value = err.message || "Failed to load tasks";
  }
}

async function deleteTask(taskId) {
  try {
  await deleteTaskApi(taskId);
  toast.value.add({ severity: 'success', summary: 'Task Deleted', detail: 'The task was deleted successfully.', life: 3000 });
  await loadTasks();
  } catch (err) {
  error.value = err.message || "Failed to delete task";
  toast.value.add({ severity: 'error', summary: 'Delete Failed', detail: error.value, life: 3000 });
  }
}

function onPage(event) {
  console.log("Page Event:", event);
  offset.value = event.first;
  limit.value = event.rows;
  loadTasks();
}

function goToTaskDetail(id) {
  router.push({ path: `/task/${id}` });
}

async function addTask(values) {
  console.log("Form Values:", values);
  try {
    const body = {};
    if (values.title !== undefined) body.title = values.title;
    if (values.description !== undefined) body.description = values.description;
    if (values.priority && values.priority.value !== undefined)
      body.priority = values.priority.value;
    if (values.category_id && values.category_id.value !== undefined)
      body.category_id = values.category_id.value;
    if (values.due_date !== undefined && values.due_date !== "")
      body.due_date = values.due_date;
    if (values.image_url !== undefined && values.image_url !== "")
      body.image_url = values.image_url;
    console.log("Request Body:", body);
  await addTaskApi(body);
  toast.value.add({ severity: 'success', summary: 'Task Added', detail: 'The task was added successfully.', life: 3000 });
    if (body.category_id !== undefined) {
      category_id.value = body.category_id;
    }
    showAddDialog.value = false;
    await loadTasks();
  } catch (err) {
  error.value = err.message || "Failed to add task";
  toast.value.add({ severity: 'error', summary: 'Add Failed', detail: error.value, life: 3000 });
  }
}

onMounted(() => {
  loadCategories();
  loadTasks();
});

watch([limit, offset, category_id], loadTasks);

watch(category_id, (val) => {
  localStorage.setItem("lastCategoryId", val);
});

onActivated(() => {
  const stored = localStorage.getItem("lastCategoryId");
  if (stored) category_id.value = Number(stored);
});
</script>

<style scoped></style>
