// src/utils/fetchClient.js

const BASE_URL = "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1/" 

let onLoadingChange = () => {}

export function setLoadingCallback(cb) {
  onLoadingChange = cb
}

export async function apiFetch(endpoint, options = {}) {
  onLoadingChange(true)

  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE"
    const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE"
    const headers = {
      "Content-Type": "application/json",
        apikey: apikey,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

 
    const url = `${BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        status: response.status,
        message: errorData.message || "Something went wrong",
      }
    }

    if (response.status === 204) {
      return { success: true }
    }

    // Handle 201 or 200 with empty body
    const text = await response.text();
    if (!text) {
      return { success: true }
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("API Error:", error)
    throw error
  } finally {
    onLoadingChange(false)
  }
}
