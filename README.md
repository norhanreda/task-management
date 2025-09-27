
# Task Management App

This is a modern task management application built with Vue 3, Vite, PrimeVue, vee-validate, and Tailwind CSS.

## Features

- View, add, edit, and delete tasks
- Task details with dynamic badge colors for priority, completion, and due date
- Category and priority dropdowns with validation
- Pagination for task list
- Add/Edit dialogs with robust form validation
- Toggle completed state with InputSwitch
- API calls separated into service files for clean architecture

## Tech Stack

- Vue 3 with `<script setup>` composition API
- Vite for fast development
- PrimeVue for UI components (Dialog, Dropdown, Paginator, InputSwitch)
- vee-validate and Yup for form validation
- Tailwind CSS for styling
- API calls via custom `fetchClient` utility

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
3. Open [http://localhost:5173](http://localhost:port) in your browser.

## Customization

- To add new API endpoints, create a new service file in `src/services/` and import it in your components.
- UI and validation logic can be extended in the component files.

