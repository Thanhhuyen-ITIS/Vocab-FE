import axios from "axios";

async function getUser()
    await axios.get("user/me").then((res) => {
        return res.data;
    };
}

export default getUser();