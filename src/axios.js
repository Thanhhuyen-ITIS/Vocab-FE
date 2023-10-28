import axios from "axios";

axios.defaults.baseURL = "https://vocab-be.knowx.vn/";
axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
