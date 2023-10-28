<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(null);
const vocabs = ref([]);
const isShowEdit = ref(false);
const indexWord = ref(null);
const wordEdit = ref(null);

const showEdit = () => {
  isShowEdit.value = true;
  console.log(isShowEdit.value);
};

const goToLearn = () => {
  router.push("/learn");
};

onMounted(async () => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
  await axios
    .get("user/me")
    .then((res) => {
      console.log(res.data);
      user.value = res.data;
    })
    .catch((err) => {
      router.push("/login");
    });

  let api_vocab = user.value.role == 1 ? "vocab/all/" : "vocab/me/all";
  const res2 = await axios.get(api_vocab);
  vocabs.value = res2.data;
});
</script>

<template>
  <main v-if="user">
    <h1 class="font-extrabold text-3xl center">List vocabs</h1>
    <div class="flex justify-end">
      <button class="p-2 m-3 rounded-md bg-emerald-800 text-white">
        New word
      </button>
      <button
        class="p-2 m-3 rounded-md bg-blue-800 text-white"
        @click="goToLearn"
      >
        Start
      </button>
    </div>
    <div class="w-full">
      <table class="w-full">
        <thead class="text-xl font-medium table-header">
          <tr class="">
            <th>Stt</th>
            <th>Word</th>
            <th>Meaning</th>
            <th>User_id</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="(vocab, index) in vocabs" :key="vocab.id">
            <td>{{ index + 1 }}</td>
            <td>{{ vocab.word }}</td>
            <td>{{ vocab.meaning }}</td>
            <td>{{ vocab.user_id }}</td>
            <td>
              <button
                class="p-2 rounded-md bg-green-500 text-white m-1"
                @click="showEdit"
              >
                Edit
              </button>
              <button class="p-2 rounded-md bg-red-500 text-white m1-1">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isShowEdit" class="fixed bg-slate-950">
      <div>
        <label for="word">Word</label>
        <input type="text" id="word" v-model="wordEdit.word" />
      </div>
      <div>
        <label for="meaning">Meaning</label>
        <input type="text" id="meaning" v-model="wordEdit.meaning" />
      </div>

      <div>
        <button
          class="p-2 rounded-md bg-green-600 hover:bg-green-800 text-white"
        >
          Save
        </button>
        <button class="p-2 rounded-md bg-gray-300 hover:bg-slate-400">
          Cancel
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.table-header {
  border: 1px solid #d6d6d6;
  background: #f1f1f1;
}
th {
  border: 1px solid #d6d6d6;
  padding: 10px;
}
td {
  border: 1px solid #d6d6d6;
  padding: 10px;
}
</style>
