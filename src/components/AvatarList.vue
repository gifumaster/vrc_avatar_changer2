
<template>
  <div class="container">
    <div style="border-bottom:1px solid red;background-color: #EFEFEF; padding: 10px">
      <div class="d-flex">
        <v-text-field v-model="keyword" class="wordSearch mr-3" hide-details="auto" density max-width="300px" placeholder="ワード検索"></v-text-field>
        <v-btn
          @click="() => (openTagEditorDialog = true)"
          color="primary"
          class="mr-3"
          :disabled="disableFetch"
          density="compact"
          >タグを編集</v-btn
        >
        <v-btn
          @click="handleGetAvatar"
          color="primary"
          class="mr-3"
          :disabled="disableFetch"
          density="compact"
          >アバターリストを取得(更新)</v-btn
        >
        <span style="color: black; white-space: nowrap; font-size: 0.7rem;">{{
          tagPlaceholder
        }}</span>
      </div>

      <div style="max-height: 300px; overflow-y: scroll">
        <tag-input v-model="searchArray" :key="version" />
      </div>
    </div>
    <div v-if="disableFetch" class="mx-auto">
      <v-progress-circular
        size="64"
        class="mx-auto"
        indeterminate
        color="primary lighten-5"
      ></v-progress-circular>
    </div>
    <div
      class="d-flex flex-wrap"
      style="
        overflow-y: scroll;
        margin-top: 5px;
        margin-left: 5px;
        align-items: flex-start;
      "
    >
      <div v-for="avatar in listArray" :key="avatar.id">
        <AvatarDetail
          v-bind:name="avatar.name"
          v-bind:description="avatar.description"
          v-bind:thumbnail-image-url="avatar.thumbnailImageUrl"
          @click="() => openDialog(avatar.id, avatar.name, avatar.imageUrl)"
        />
      </div>
    </div>

    <AvatarChangeDialog
      v-model="dialog"
      :avatar-id="avatarId"
      :avatar-name="avatarName"
      :avatar-image="avatarImage"
      :change-avatar="handelAvatarChange"
      :update-avatar="handleUpdateAvatar"
    ></AvatarChangeDialog>
    <LoginDialog v-model="openLoginDialog">
      <div
        class="position-fixed bottom-0 left-0 right-0 pa-3 w-100"
        style="background-color: white"
      >
        <template v-if="firstLogin">
          <v-text-field
            v-model="userName"
            placeholder="username"
          ></v-text-field>
          <v-text-field
            v-model="password"
            placeholder="password"
            type="password"
          ></v-text-field>
          <v-btn @click="handleLogin" :disabled="disabledLoginBtn">Login</v-btn>
        </template>
        <template v-if="!firstLogin">
          <v-text-field
            label="2段階認証(OTP)"
            v-model="auth2faNumber"
            placeholder="000000"
          ></v-text-field>
          <v-btn @click="handleTwoFactorAuth" :disabled="disabled2FABtn">2FA</v-btn>
        </template>
      </div>
    </LoginDialog>

    <TagEditorDialog v-model="openTagEditorDialog">
      <div style="background-color: white">
        <TagEditor />
      </div>
    </TagEditorDialog>
  </div>
</template>

<script setup>
// import list from "@/assets/json/avatar.json";
import { computed, ref, watch } from "vue";
import AvatarDetail from "./AvatarDetail.vue";
import TagInput from "./TagInput.vue";
import AvatarChangeDialog from "./AvatarChangeDialog.vue";
import LoginDialog from "./LoginDialog.vue";
import TagEditor from "./TagEditor.vue";
import TagEditorDialog from "./TagEditorDialog.vue";
import  {
  execVRChatLogin,
  execTwoFactorAuth,
  execGetAvatarList,
  execChangeAvatar,
  execTokenCheck,
  execGetAvatar
} from "../composable/useVRChatApi.js"


const auth2faNumber = ref("");
const authToken = ref("");
const list = ref([]);
const dialog = ref(false);
const avatarId = ref("");
const avatarName = ref("");
const avatarImage = ref("");
const searchArray = ref([]);
const userName = ref("");
const password = ref("");
const openLoginDialog = ref(false);
const openTagEditorDialog = ref(false);
const firstLogin = ref(true);
const disableFetch = ref(false);
const version = ref(0);
const authType = ref('totp');
const keyword = ref('');

const init = async () => {
  const authCookie = localStorage.getItem("authCookie");
  if (authCookie === null) {
    openLoginDialog.value = true;
    return;
  }
  authToken.value = authCookie;
  handleTokenCheck();

  const avatarList = localStorage.getItem("avatarList");
  if (avatarList === null) {
    list.value = [];
    return;
  }
  list.value = JSON.parse(avatarList);
};

const openDialog = (id, name, imageUrl) => {
  avatarId.value = id;
  avatarName.value = name;
  avatarImage.value = imageUrl;
  dialog.value = true;
};

const handleLogin = async () => {
  const result = await execVRChatLogin({
    userName: userName.value,
    password: password.value,
    num: auth2faNumber.value,
  });

  authToken.value = result.authToken;

  const check = await execTokenCheck({
    authToken: authToken.value,
  });

  if (check === true) {
    openLoginDialog.value = false;
  } else {
    authType.value = check;
    firstLogin.value = false;
  }

  localStorage.setItem("authCookie", result.authToken);
};

const handleTwoFactorAuth = async () => {
  const result = await execTwoFactorAuth({
    authToken: authToken.value,
    num: auth2faNumber.value,
    mode: authType.value
  });

  const check = await execTokenCheck({
    authToken: authToken.value,
  });

  if (check === true) {
    openLoginDialog.value = false;
    firstLogin.value = true;
  }
};

const handleTokenCheck = async () => {
  if (authToken.value === "") {
    openLoginDialog.value = true;
    return;
  }

  const result = await execTokenCheck({
    authToken: authToken.value,
  });

  if (result !== true) {
    authType.value = result;
    openLoginDialog.value = true;
  }
};

const handleGetAvatar = async () => {
  //結果が60未満になるまでループさせる。時間はすこしあける
  //最大でも16回まで
  list.value = [];
  let temp = [];
  disableFetch.value = true;

  for (let i = 0; i < 10; i++) {
    //
    const result = await execGetAvatarList({
      authToken: authToken.value,
      offsetMultiply: i,
    });

    if (result?.error) {
      console.info(result);
      return;
    }
    temp = temp.concat(result);

    if (result.length < 100) {
      break;
    }
    await sleep(1000);
  }
  localStorage.setItem("avatarList", JSON.stringify(temp));
  list.value = temp;
  disableFetch.value = false;
};

const handleUpdateAvatar = async () => {
  const result = await execGetAvatar({
    id: avatarId.value,
    authToken: authToken.value,
  });

  // list.valueから同じIDのものを探して置き換える
  const temp = updateElement(list.value,result);

  localStorage.setItem("avatarList", JSON.stringify(temp));
  list.value = temp;
};

const sleep = (time) => new Promise((r) => setTimeout(r, time));

const handelAvatarChange = async () => {
  await execChangeAvatar({
    id: avatarId.value,
    authToken: authToken.value,
  });
};

const filter = (list) => {
  let temp = list.value;

  if (searchArray.value.length > 0) {
    for (const searchText of searchArray.value) {
      temp = temp.filter((i) => {
        if (
          i.description.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          i.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        ) {
          return true;
        }
      });
    }
  }

  // キーワード検索
  if (keyword.value) {
    // 半角スペースでsplitする。
    const keywordList = keyword.value.split(/[\s,　]/);
    for (const searchText of keywordList) {
      temp = temp.filter((i) => {
        if (
          i.description.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          i.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        ) {
          return true;
        }
      });
    }
  }  
  return temp.map((i) => {
    return {
      id: i.id,
      thumbnailImageUrl: i.thumbnailImageUrl,
      name: i.name,
      imageUrl: i.imageUrl,
      description: i.description,
    };
  });
};

const listArray = computed(() => filter(list));

const tagPlaceholder = computed(() => {
  //
  return (
    list.value.length + "件中のうち" + listArray.value.length + "件を表示中"
  );
});

const disabledLoginBtn = computed(() => {
  return userName.value === "" || password.value === ""
})
const disabled2FABtn = computed(() => {
  return auth2faNumber.value === ""
})

const updateElement = (origin, obj) => {
    // arr1をループしてidをチェックし、idが同じものがあれば更新
    for (let i = 0; i < origin.length; i++) {
        if (origin[i].id === obj.id) {
            // updatedAtが異なる場合、元の配列のオブジェクトを置き換える
            origin[i] = obj;
            break; // 一致するものが見つかったらループを終了
        }
    }
    return origin;
}

watch(openTagEditorDialog, async (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    version.value += 1;
    //location.reload();
  }
});

init();
</script>

<style scope>
.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.avatar-grid {
  padding: 0;
}

.no-space {
  padding: 0;
  margin: 0;
}

</style>
