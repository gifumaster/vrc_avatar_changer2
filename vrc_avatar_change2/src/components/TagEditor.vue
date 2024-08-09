<!-- src/components/TagEditor.vue -->
<template>
  <v-card>
    <v-card-text style="height: 500px; overflow-y: scroll">
      <div class="d-flex">
        <v-text-field
          v-model="newTag.name"
          placeholder="タグ名"
          required
          density="compact"
          class="mx-2"
        />
        <v-text-field
          v-model="newTag.searchName"
          placeholder="検索名"
          required
          density="compact"
          class="mx-2"
        />
        <v-switch v-model="newTag.only" label="only" color="primary"></v-switch>
        <v-btn @click="addTag" color="primary">追加</v-btn>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <ul class="d-flex flex-wrap">
        <li v-for="(tag, index) in tags" :key="index">
          <span
            >{{ tag?.only ? "*" : "" }} {{ tag.name }} /
            {{ tag.searchName }}</span
          >
          <v-btn color="red" @click="removeTag(index)">削除</v-btn>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const newTag = ref({
      name: "",
      searchName: "",
      only: false,
    });

    const tags = ref([]);
    const errorMessage = ref("");

    const addTag = () => {
      // バリデーション
      if (newTag.value.name === "" || newTag.value.searchName === "") {
        errorMessage.value = "項目を埋めてください";
        return;
      }
      if (newTag.value.name.length > 10) {
        errorMessage.value = "項目名は10文字以下";
        return;
      }

      if (newTag.value.searchName.length > 10) {
        errorMessage.value = "検索名は10文字以下";
        return;
      }

      if (tags.value.some((tag) => tag.name === newTag.value.name)) {
        errorMessage.value = "同じ項目名が既に存在します。";
        return;
      }
      if (
        tags.value.some((tag) => tag.searchName === newTag.value.searchName)
      ) {
        errorMessage.value = "同じ検索名が既に存在します。";
        return;
      }

      // タグを追加
      tags.value.push({ ...newTag.value });
      newTag.value.name = "";
      newTag.value.searchName = "";
      newTag.value.only = false;
      errorMessage.value = "";
      saveTags();
    };

    const removeTag = (index) => {
      tags.value.splice(index, 1);
      saveTags();
    };

    const saveTags = () => {
      localStorage.setItem("tags", JSON.stringify(tags.value));
    };

    const loadTags = () => {
      const savedTags = localStorage.getItem("tags");
      if (savedTags) {
        tags.value = JSON.parse(savedTags).sort((a, b) => {
          if (a.only === b.only) {
            return 0;
          }
          return a.only ? -1 : 1;
        });
      }
    };

    onMounted(() => {
      loadTags();
      if (tags.value.length === 0) {
        tags.value = [
          { name: "春", searchName: "Spring", only: false },
          { name: "夏", searchName: "Summer", only: false },
          { name: "秋", searchName: "Fall", only: false },
          { name: "冬", searchName: "Winter", only: false },
        ];
        saveTags();
      }
    });

    return {
      newTag,
      tags,
      errorMessage,
      addTag,
      removeTag,
    };
  },
};
</script>

<style scoped>
form {
  display: flex;
  gap: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  min-width: 45%;
  margin-right: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

button {
  margin-left: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
