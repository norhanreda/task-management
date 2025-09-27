<template>
  <Toast ref="toast" />
  <div v-if="loading" class="flex flex-col items-center justify-center mt-10">
    <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" fillColor="#eee" animationDuration="1s" />
    <span class="mt-4 text-blue-700">Loading...</span>
  </div>
  <h1 v-else class="flex items-center justify-center text-2xl p-8 text-blue-900 font-bold">Task Detail</h1>
  <div
    v-if="task && !loading"
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
      <span
        class="px-2 py-1 rounded-full text-xs"
        :class="{
          'bg-red-100 text-red-800': task.priority === 'high',
          'bg-yellow-100 text-yellow-800': task.priority === 'medium',
          'bg-green-100 text-green-800': task.priority === 'low',
        }"
      >
        Priority: {{ task.priority }}
      </span>

      <div class="flex items-center gap-2">
        <label for="completed-switch" class="text-xs font-semibold"
          > Completed:</label
        >
        <InputSwitch
          id="completed-switch"
          :modelValue="task.completed"
          @update:modelValue="toggleCompletedSwitch"
        />
      </div>
      <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
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
          <Field name="priority" v-slot="{ field, errorMessage, handleChange }">
            <label class="font-semibold mb-0.5 block" for="priority"
              >Priority</label
            >
            <Dropdown
              :modelValue="field.value"
              @update:modelValue="handleChange($event)"
              :options="priorityOptions"
              id="priority"
              placeholder="Priority"
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
          <Field
            name="completed"
            v-slot="{ field, errorMessage, handleChange }"
          >
            <label class="font-semibold mb-0.5 block" for="completed"
              >Completed</label
            >
            <InputSwitch
              :modelValue="field.value"
              @update:modelValue="handleChange($event)"
              id="completed"
              class="mb-2"
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

</template>
<script setup>
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import { ref as vueRef } from 'vue';
const toast = vueRef();
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchTaskById, updateTask } from "../services/taskService";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputSwitch from "primevue/inputswitch";
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const route = useRoute();
const router = useRouter();

const task = ref(null);
const loading = ref(false);
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
    .nullable()
    .matches(/^[\d]{4}-[\d]{2}-[\d]{2}$/, "Invalid date format"),
  completed: yup.boolean().required("Completed is required"),
  image_url: yup.string().max(500, "Max 500 characters").nullable(),
});

async function fetchTask() {
  loading.value = true;
  try {
    const response = await fetchTaskById(route.params.id);
    task.value = (response.data || response)[0] || null;
  } catch (err) {
    error.value = err.message || "Failed to load task";
  } finally {
    loading.value = false;
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
    const body = {};
    if (values.title !== undefined) body.title = values.title;
    if (values.description !== undefined) body.description = values.description;
    if (values.priority !== undefined && values.priority !== "")
      body.priority = values.priority;
    if (values.due_date !== undefined && values.due_date !== "")
      body.due_date = values.due_date;
    if (values.completed !== undefined) body.completed = values.completed;
    if (values.image_url !== undefined && values.image_url !== "")
      body.image_url = values.image_url;
  await updateTask(route.params.id, body);
  toast.value.add({ severity: 'success', summary: 'Task Updated', detail: 'The task was updated successfully.', life: 3000 });
  await fetchTask();
  showEditDialog.value = false;
  } catch (err) {
  error.value = err.message || "Failed to update task";
  toast.value.add({ severity: 'error', summary: 'Update Failed', detail: error.value, life: 3000 });
  }
}

function toggleCompletedSwitch(val) {
  if (!task.value) return;
  updateTask(route.params.id, { completed: val })
    .then(() => {
      toast.value.add({ severity: 'success', summary: 'Task Updated', detail: 'Completed state updated.', life: 3000 });
      fetchTask();
    })
    .catch((err) => {
      error.value = err.message || 'Failed to update task';
      toast.value.add({ severity: 'error', summary: 'Update Failed', detail: error.value, life: 3000 });
    });
}
</script>
