<template>
  <h1
    class="flex items-center justify-center text-2xl p-8 text-blue-900 font-bold"
  >
    Task Detail
  </h1>
  <div
    v-if="task"
    class="rounded-md shadow-2xl p-5 w-[60%] flex flex-col m-auto"
  >
    <button
      @click="goBack"
      class="cursor-pointer mb-4 self-start flex items-center gap-2 text-blue-700 hover:text-blue-900"
    >
      <i class="pi pi-arrow-left"></i>
    </button>
    <button
      @click="openEditDialog"
      class="self-end mb-2 px-4 py-1 rounded bg-blue-800 text-white hover:bg-blue-600"
    >
      Edit
    </button>
    <h2 class="text-2xl p-8 text-blue-900 font-bold">{{ task.title }}</h2>
    <div class="flex flex-col items-center justify-center">
      <img v-if="task.image_url" class="mx-auto" :src="task.image_url" />
      <p class="text-center mt-6">{{ task.description }}</p>
    </div>

    <div class="flex flex-wrap gap-4 mb-2 mt-4">
      <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
        >Priority: {{ task.priority }}</span
      >
      <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
        >Completed: {{ task.completed ? "Yes" : "No" }}</span
      >
      <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
        >Due Date: {{ task.due_date }}</span
      >
    </div>
    <Dialog
      v-model:visible="showEditDialog"
      modal
      header="Edit Task"
      :style="{ width: '400px' }"
    >
      <Form
        :validation-schema="taskSchema"
        :initial-values="editTaskData"
        @submit="editTask"
      >
        <div class="flex flex-col gap-3">
          <Field name="title" v-slot="{ field, errorMessage }">
            <input
              v-bind="field"
              class="border rounded p-2"
              placeholder="Title"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="description" v-slot="{ field, errorMessage }">
            <textarea
              v-bind="field"
              class="border rounded p-2"
              placeholder="Description"
            ></textarea>
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="priority" v-slot="{ field, errorMessage, handleChange }">
            <Dropdown
              :modelValue="field.value"
              @update:modelValue="handleChange($event)"
              :options="priorityOptions"
              placeholder="Priority"
              class="w-full"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="due_date" v-slot="{ field, errorMessage }">
            <input
              v-bind="field"
              type="date"
              class="border rounded p-2"
              placeholder="Due Date"
            />
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="completed" v-slot="{ field, errorMessage }">
            <select v-bind="field" class="border rounded p-2">
              <option :value="true">Completed</option>
              <option :value="false">Not Completed</option>
            </select>
            <span class="text-red-600 text-xs">{{ errorMessage }}</span>
          </Field>
          <Field name="image_url" v-slot="{ field, errorMessage }">
            <input
              v-bind="field"
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
            @click="showEditDialog = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </Form>
    </Dialog>
  </div>
  <div v-else-if="error" class="text-red-600 text-center mt-8">{{ error }}</div>
  <div v-else class="text-center mt-8">Loading...</div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiFetch } from "../utils/fetchClient";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const route = useRoute();
const router = useRouter();

const task = ref(null);
const error = ref(null);
const showEditDialog = ref(false);
const editTaskData = ref({
  title: "",
  description: "",
  priority: "",
  due_date: "",
  completed: false,
  image_url: "",
});
const priorityOptions = ["low", "medium", "high"];

const taskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(255, "Max 255 characters"),
  description: yup.string().nullable(),

  due_date: yup
    .string()
    .required("Due date is required")
    .matches(/^[\d]{4}-[\d]{2}-[\d]{2}$/, "Invalid date format"),
  completed: yup.boolean().required("Completed is required"),
  image_url: yup.string().max(500, "Max 500 characters").nullable(),
});

async function fetchTask() {
  try {
    const response = await apiFetch(`tasks?id=eq.${route.params.id}`);
    task.value = (response.data || response)[0] || null;
  } catch (err) {
    error.value = err.message || "Failed to load task";
  }
}

onMounted(fetchTask);

function goBack() {
  router.back();
}

function openEditDialog() {
  if (task.value) {
    editTaskData.value = {
      title: task.value.title,
      description: task.value.description,
      priority: task.value.priority ? task.value.priority.toLowerCase() : "",
      due_date: task.value.due_date,
      completed: Boolean(task.value.completed),
      image_url: task.value.image_url,
    };
  }
  showEditDialog.value = true;
}

async function editTask(values) {
  console.log("Form Values:", values);
  try {
    const body = {
      title: values.title,
      description: values.description,
      priority: values.priority, // use string directly
      due_date: values.due_date,
      completed: values.completed,
      image_url: values.image_url,
    };
    await apiFetch(`tasks?id=eq.${route.params.id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    await fetchTask();
    showEditDialog.value = false;
  } catch (err) {
    error.value = err.message || "Failed to update task";
  }
}
</script>
<style scoped></style>
