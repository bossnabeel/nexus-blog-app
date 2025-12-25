<script setup>
import { ref } from "vue";

const form = ref({
  title: "",
  content: "",
});

async function handleSubmit() {
  // Backend logic yahan ayegi
  console.log("Publishing:", form.value);
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-[#0f172a] p-4 sm:p-8">
    <div
      class="max-w-3xl mx-auto bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50"
    >
      <div class="p-6 border-b border-slate-100 dark:border-slate-700/50">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          Create New Story
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Share your thoughts with the world.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="space-y-2">
          <label
            class="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Title</label
          >
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter a catchy title..."
            class="w-full px-4 py-3 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-lg font-medium"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Category</label
          >
          <select
            v-model="form.category"
            class="w-full px-4 py-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm"
          >
            <option>General</option>
            <option>Technology</option>
            <option>Lifestyle</option>
          </select>
        </div>

        <div class="space-y-2">
          <label
            class="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Content</label
          >
          <textarea
            v-model="form.content"
            rows="10"
            placeholder="Write your story here..."
            class="w-full px-4 py-3 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm resize-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            class="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Save Draft
          </button>
          <button
            type="submit"
            class="px-8 py-2.5 text-sm font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.97] transition-all"
          >
            PUBLISH STORY
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
