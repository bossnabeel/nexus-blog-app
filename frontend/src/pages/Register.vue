<script setup>
import { ref } from "vue";
const showPassword = ref(false);
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
});

async function handleRegister() {}
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 bg-slate-100 dark:bg-[#0f172a]"
  >
    <div
      class="w-[95%] max-w-[420px] p-5 sm:p-8 rounded-2xl shadow-xl bg-white dark:bg-[#1e293b] border border-slate-200/60 dark:border-slate-700/50"
    >
      <div class="mb-5 text-center sm:text-left">
        <span
          class="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold text-teal-700 uppercase bg-teal-100 rounded-full dark:text-teal-300 dark:bg-teal-900/30"
        >
          JOIN US
        </span>
        <h1
          class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
        >
          Create Account
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Start your blogging journey today.
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-2 sm:space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model="form.firstName"
            type="text"
            placeholder="First Name"
            class="w-full px-3 py-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm"
          />

          <input
            v-model="form.lastName"
            type="text"
            placeholder="Last Name"
            class="w-full px-3 py-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm"
          />
        </div>

        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          class="w-full px-3 py-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm"
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email Address"
          class="w-full px-3 py-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm"
        />

        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="w-full px-3 py-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all text-sm"
          />

          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!showPassword"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
              />
            </svg>
          </button>
        </div>

        <button
          type="submit"
          class="w-full py-3 mt-2 text-sm font-bold text-white rounded-xl bg-teal-500 hover:bg-teal-600 shadow-md active:scale-[0.97] transition-all cursor-pointer"
        >
          CREATE ACCOUNT
        </button>
      </form>

      <p
        class="mt-6 text-[12px] sm:text-sm text-center text-slate-500 dark:text-slate-400"
      >
        Already have an account?
        <a
          href="/login"
          class="font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >Login here</a
        >
      </p>
    </div>
  </div>
</template>
