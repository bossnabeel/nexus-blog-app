<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
const posts = ref([]);
</script>
<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-20 transition-colors duration-300"
  >
    <header
      class="relative py-16 sm:py-20 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#1e293b]/30"
    >
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="relative group">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"
            ></div>
            <div
              class="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-slate-900 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden"
            >
              <span class="text-5xl font-black text-teal-500">N</span>
            </div>
          </div>

          <div class="flex-1 text-center md:text-left">
            <span
              class="inline-block px-3 py-1 mb-2 text-[10px] font-bold tracking-widest text-teal-600 bg-teal-100 rounded-full dark:text-teal-300 dark:bg-teal-900/30 uppercase"
            >
              Member Since 3 years
            </span>
            <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2">
              Bossnabeel
            </h1>
            <p class="text-slate-500 dark:text-slate-400 font-medium mb-6">
              {{ "Creative Developer & Storyteller" }}
            </p>

            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <button
                class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 active:scale-95"
              >
                Edit Profile
              </button>
              <button
                class="border border-red-500/50 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div
              class="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50 text-center"
            >
              <p class="text-2xl font-black text-teal-500">{{ "10k" }}</p>
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >
                likes
              </p>
            </div>
            <div
              class="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50 text-center"
            >
              <p class="text-2xl font-black text-teal-500">99+</p>
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >
                Posts
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center gap-4 mb-10">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">
          Your <span class="text-teal-500">Stories</span>
        </h2>
        <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          class="group flex flex-col bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <div
            class="h-1.5 w-full bg-teal-500/10 group-hover:bg-teal-500 transition-colors"
          ></div>
          <div class="p-6">
            <h3
              class="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-teal-500 transition-colors"
            >
              test txt
            </h3>
            <p
              class="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed italic"
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat
              mollitia, blanditiis inventore consectetur autem repudiandae quam,
              magni necessitatibus repellendus ducimus suscipit.
            </p>
            <div class="flex items-center gap-4">
              <button class="text-xs font-bold text-teal-500 hover:underline">
                Edit Post
              </button>
              <button class="text-xs font-bold text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="false"
        class="text-center py-20 bg-white dark:bg-[#1e293b]/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
      >
        <p class="text-slate-500 dark:text-slate-400 italic">
          You haven't shared any stories yet.
        </p>
        <router-link
          to="/create-post"
          class="mt-4 inline-block text-teal-500 font-bold hover:underline"
          >Start writing now</router-link
        >
      </div>
    </main>
  </div>
</template>
