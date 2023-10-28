<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";


const router = useRouter();

const user = ref(null);
const vocabs = ref([]);

const indexWord = ref(null);
const userAnswer = ref("");
const result = ref(null);
const state = ref(0);
const isFinish = ref(false);

const Submit = () => {
  isFinish.value ? again() : state.value == 0 ? checkAnswer() : Random();
};

const Random = () => {
  if (indexWord.value == 0 || indexWord.value) {
    vocabs.value.splice(indexWord.value, 1);
  }
  if (vocabs.value.length == 0) {
    isFinish.value = true;
    state.value = 0;
    userAnswer.value = "";
    result.value = null;
    return;
  }
  let random = Math.floor(Math.random() * vocabs.value.length);
  indexWord.value = random;
  state.value = 0;
  userAnswer.value = "";
  result.value = null;
};

const checkAnswer = () => {
  if (
    userAnswer.value.toLowerCase() ===
    vocabs.value[indexWord.value].meaning.toLowerCase()
  ) {
    result.value = true;
  } else {
    result.value = false;
  }
  state.value = 1;
  console.log("check");
};

const again = async () => {
  const res2 = await axios.get("vocab/me/all");
  vocabs.value = res2.data;
  isFinish.value = false;
  indexWord.value = null;
  Random();
};

const handleEnterKey = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    Submit();
  }
};



onMounted(async () => {
  window.addEventListener("keydown", handleEnterKey);
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
  const res = await axios.get("user/me");
  user.value = res.data;

  if (!user.value) {
    router.push("/login");
  }

  const res2 = await axios.get("vocab/me/all");
  vocabs.value = res2.data;
  Random();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEnterKey);
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen"
    v-if="user && vocabs"
  >
    <div class="rounded-md p-4">
      <form @submit.prevent="Submit" class="w-full">
        <p class="font-medium sm:text-3xl text-2xl">
          Enter meaning of this word
        </p>
        <div class="mt-10 flex flex-col items-center justify-center">
          <div class="w-full">
            <p
              class="font-medium text-2xl rounded-md p-3 mb-5 text-green-950 w-full text-sky-700 text-center"
            >
              {{ vocabs[indexWord] ? vocabs[indexWord].word : "" }}
            </p>
            <input
              type="text"
              class="p-2 border border-2 rounded-md w-full"
              placeholder="meaning"
              v-model="userAnswer"
              :disabled="state == 1"
            />
          </div>
        </div>
        <div
          class="flex justify-between items-center rounded-md mt-5 p-2"
          :class="
            state == 0 && !isFinish
              ? ''
              : result || isFinish
              ? 'bg-green-200'
              : 'bg-red-200'
          "
        >
          <div>
            <p
              :class="result || isFinish ? 'text-green-700' : 'text-red-600'"
              class="font-bold text-lg"
            >
              {{
                isFinish
                  ? "Completed all vocabulary"
                  : state == 0
                  ? ""
                  : result
                  ? "Correct answer"
                  : "Wrong"
              }}
            </p>
            <p v-if="!result && state == 1" class="text-red-600">
              Correct answer: {{ vocabs[indexWord].meaning }}
            </p>
          </div>

          <button
            type="submit"
            v-if="!isFinish"
            class="rounded-md p-2 shadow shadow-md text-white"
            :class="
              isFinish
                ? 'bg-slate-600'
                : state == 0
                ? ' bg-green-600'
                : result
                ? 'bg-green-700 hover:bg-green-800'
                : 'bg-red-700 hover:bg-red-800'
            "
          >
            {{ state == 0 ? "Submit" : "Next" }}
          </button>
        </div>
        <div class="flex justify-between items-center rounded-md mt-5 p-2">
          <button
            v-if="isFinish"
            class="rounded-md p-2 shadow shadow-md text-white bg-emerald-950"
            @click="again"
          >
            Again
          </button>
          <button
            @click="router.push('/')"
            v-if="isFinish"
            class="rounded-md p-2 shadow shadow-md text-white bg-blue-700 ml-1"
          >
            Home
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
