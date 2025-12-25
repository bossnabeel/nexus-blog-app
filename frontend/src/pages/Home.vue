<script setup>
import { computed, onMounted, ref } from "vue";

const activeCommentId = ref(null);
const newComment = ref("");
const comments = ref([]);
const posts = ref([]);
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-20 transition-colors duration-300"
  >
    <header
      class="relative py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#1e293b]/30"
    >
      <div class="max-w-7xl mx-auto px-4 text-center">
        <span
          class="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-teal-600 bg-teal-100 rounded-full dark:text-teal-300 dark:bg-teal-900/30 uppercase"
        >
          Community Blog
        </span>
        <h1
          class="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6"
        >
          Read, Share & Discover <span class="text-teal-500">Stories</span>
        </h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- post Card  -->
        <div v-if="false" class="text-center py-20 text-slate-400">
          Loading posts...
        </div>
        <article
          class="group flex flex-col grow bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <div
            class="h-1.5 w-full bg-teal-500/10 group-hover:bg-teal-500 transition-colors"
          ></div>

          <div class="p-6 flex flex-col flex-1">
            <div
              class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4"
            >
              <span class="text-teal-500">Bossnabeel</span>
              <span>•</span>
              <span>{{
                new Date('2025-12-24 22:07:27.094').toLocaleDateString("en-GB")
              }}</span>
            </div>

            <h3
              class="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-teal-500 transition-colors"
            >
              demo text 
            </h3>
            <p
              class="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed italic"
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id, deserunt!
            </p>

            <div
              class="flex items-center gap-6 mb-6 pt-4 border-t border-slate-50 dark:border-slate-800/50"
            >
              <button
                class="flex items-center gap-1.5 cursor-pointer hover:scale-110 transition-transform"
              >
                <span class="text-xl">🤍</span>
                <span class="text-xs font-bold dark:text-slate-300">
                 100k
                </span>
              </button>

              <button
                class="flex items-center gap-1.5 cursor-pointer hover:scale-110 transition-transform"
              >
                <span class="text-xl">💬</span>
                <span class="text-xs font-bold dark:text-slate-300">20k</span>
              </button>
            </div>
            <!-- v-if="" -->
            <div
              v-if="false"
              class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-3"
            >
              <div
                class="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar"
              >
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="group/c flex justify-between items-start gap-4"
                >
                  <div class="flex-1">
                    <p class="text-[10px] font-black text-teal-600 uppercase">
                      dummy
                    </p>
                    <p class="text-xs text-slate-700 dark:text-slate-300">
                      dummy
                    </p>
                  </div>
                  <button
                    class="hover:cursor-pointer opacity-0 group-hover/c:opacity-100 text-[9px] font-bold text-red-500 hover:underline transition-all"
                  >
                    DELETE
                  </button>
                </div>

                <p
                  v-if="false"
                  class="text-center text-[11px] text-slate-400 italic py-2"
                >
                  No comments yet.
                </p>
              </div>

              <div class="mt-5 flex gap-2">
                <input
                  v-model="newComment"
                  class="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="Write a comment..."
                />
                <button
                  @click="addComment(post.id)"
                  class="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-teal-500/20"
                >
                  POST
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #14b8a6;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
