<script setup>
import { ref } from "vue";
// import CommentItem from '../components/CommentItem.vue';

const post = ref({
  title: "How to build a scalable backend with Node.js",
  author: "Bossnabeel",
  date: "Dec 25, 2025",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
  likes: 124,
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-[#0f172a] p-4 sm:p-8">
    <article
      class="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50"
    >
      <div class="p-8 sm:p-12 pb-6">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="px-3 py-1 text-[10px] font-bold text-teal-700 uppercase bg-teal-100 rounded-full dark:text-teal-300 dark:bg-teal-900/30"
          >
            Technology
          </span>
          <span class="text-xs text-slate-400">{{ post.date }}</span>
        </div>

        <h1
          class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8"
        >
          {{ post.title }}
        </h1>

        <div
          class="flex items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-700/50"
        >
          <div
            class="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl"
          >
            {{ post.author[0] }}
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900 dark:text-white">
              {{ post.author }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Creative Developer
            </p>
          </div>
        </div>
      </div>

      <div class="px-8 sm:px-12 py-6">
        <div
          class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg"
        >
          {{ post.content }}
        </div>
      </div>

      <div
        class="px-8 sm:px-12 py-8 bg-slate-50/50 dark:bg-[#0f172a]/20 flex items-center justify-between"
      >
        <button
          class="flex items-center gap-2 text-slate-500 hover:text-teal-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span class="font-medium">{{ post.likes }} Likes</span>
        </button>
      </div>

      <div
        class="p-8 sm:p-12 bg-white dark:bg-[#1e293b] border-t border-slate-100 dark:border-slate-700/50"
      >
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Discussion
        </h3>
        <p class="text-sm text-slate-500 italic">
          Comments section will appear here...
        </p>
      </div>
    </article>
  </div>
</template>
