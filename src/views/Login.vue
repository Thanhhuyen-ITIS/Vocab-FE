<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref({
  username: "",
  password: "",
});

const isPending = ref(false);
const error = ref(null);

const login = async () => {
  console.log(user.value);
  const formData = new FormData();
  formData.append("username", user.value.username);
  formData.append("password", user.value.password);

  isPending.value = true;
  await axios.post("login", formData).then((res) => {
    console.log(res.data);
    localStorage.setItem("token", res.data.access_token);
    error.value = null;

    router.push("/");
  }).catch((err) => {
    console.log(err);
    error.value = err.response.data.detail;
  }).finally(() => {
    isPending.value = false;
  });
}


</script>

<template>
  <div class="h-screen w-full flex justify-center items-center text-black">
    <form class="lg:w-1/3 sm:w-1/2 w-full m-4" @submit.prevent="login">
      <p class="text-4xl font-medium w-full text-center">Đăng nhập</p>
      <div class="mt-10">
        <label for="Username" class="text-xl font-medium w-full">Email</label>
        <input
          type="text"
          id="Username"
          class="flex h-8 p-2 items-center border border-2 rounded-md placeholder:text-gray-400 w-full"
          placeholder="Enter your username"
          v-model="user.username"
          :disabled="isPending"
        />
      </div>

      <div class="mt-10 w-full">
        <label for="Password" class="text-xl font-medium">Password</label>
        <input
          type="password"
          id="Password"
          class="flex h-8 p-2 items-center border border-2 rounded-md w-full"
          placeholder="Enter your password"
          v-model="user.password"
          :disabled="isPending"
        />
      </div>
      <p v-if="error" class="mt-2 text-red-600 text-sm">{{ error }}</p>
      
      <button
        class="p-1 bg-green-900 text-white w-full rounded-md mt-8 hover:bg-green-950"
        :disabled="isPending"
      >
        Đăng nhập
      </button>
    </form>
  </div>
</template>

<style scoped></style>
