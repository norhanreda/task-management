# Task Management App

This is a modern task management application built with Vue 3, Vite, PrimeVue, vee-validate, and Tailwind CSS.

# Architecture & Design Overview

## Framework Choice: Vue vs React

This project uses **Vue 3** for its simplicity, reactivity, and excellent Single File Component (SFC) structure. Vue's `<script setup>` syntax provides a clean and concise way to manage component logic and state. Compared to React, Vue offers:
- Less boilerplate for component setup
- Built-in reactivity system without external state libraries
- Seamless integration with Vite for fast development

I chose Vue because I have strong professional experience with it in my work, which allows me to build robust and maintainable applications efficiently. React is also a strong choice, but Vue was selected for its developer experience and rapid prototyping capabilities in this context.

## State Management Approach

State is managed locally within components using Vue's `ref` and `reactive` APIs. For this app's scale, global state management (like Vuex or Pinia) is not required. Data is fetched from the API and stored in local refs, with props and events used for communication between parent and child components.

## Component Architecture Overview

- **AllTasks.vue**: Main task list, handles add/delete, pagination, and category filtering. Manages dialogs and loading state.
- **TaskDetail.vue**: Shows details for a single task, supports editing and toggling completion. Uses dialog for editing and displays dynamic badges.
- **TaskCard.vue**: Displays a single task summary, emits events for delete and navigation.
- **Service files**: API logic is separated into `src/services/taskService.js` and `src/services/categoryService.js` for clean separation of concerns.
- **Toast and Spinner**: PrimeVue Toast and ProgressSpinner are used for user feedback and loading indicators.





## Features

- View, add, edit, and delete tasks
- Task details with dynamic badge colors for priority, completion, and due date
- Category and priority dropdowns with validation
- Pagination for task list
- Add/Edit dialogs with robust form validation
- Toggle completed state with InputSwitch
- Loading spinners for data fetching (PrimeVue ProgressSpinner)
- Toast notifications for user feedback (PrimeVue Toast)
- API calls separated into service files for clean architecture

## Tech Stack

- Vue 3 with `<script setup>` composition API
- Vite for fast development
- PrimeVue for UI components (Dialog, Dropdown, Paginator, InputSwitch, Toast, ProgressSpinner)
- vee-validate and Yup for form validation
- Tailwind CSS for styling
- API calls via custom `fetchClient` utility

## Any known limitations
 I have a simple problem in pagination as the backend is not sending a parameter called totalRecords which is needed for paginator compomemt of prime vue 

## Project Structure

- `src/components/` — Main UI components (AllTasks, TaskDetail, TaskCard)
- `src/services/` — API service files (`taskService.js`, `categoryService.js`)
- `src/utils/` — Utility functions (e.g., `fetchClient.js`)

## How to Run

1. Install dependencies:
	```sh
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
3. Open [http://localhost:port] in your browser.

## Customization

- To add new API endpoints, create a new service file in `src/services/` and import it in your components.
- UI and validation logic can be extended in the component files.

## Deployed project

- https://task-management-sepia-five.vercel.app/



