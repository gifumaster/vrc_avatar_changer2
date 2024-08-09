<template>
  <input v-show="false" type="hidden" name="tags" :value="tagsJson" />
  <vue3-tags-input
    v-show="false"
    :tags="tags"
    :placeholder="title"
    @on-tags-changed="updateTags"
  />

  <div style="margin-top: 5px" class="d-flex flex-wrap">
    <template v-for="shortcut in shortcuts" :key="shortcut">
      <v-btn
        class="mt-1 mr-1"
        @click="() => add(shortcut.searchName, shortcut?.only ?? false)"
        :color="selected(shortcut.searchName, shortcut?.only ?? false)"
        >{{ shortcut.name }}</v-btn
      >
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Vue3TagsInput from "vue3-tags-input";

const shortcuts = ref([]);

const loadTags = () => {
  const savedTags = localStorage.getItem("tags");
  const list = JSON.parse(savedTags) ?? [];

  // only:true -> falseの順でsortしなおす
  shortcuts.value = list.sort((a, b) => {
    if (a.only === b.only) {
      return 0;
    }
    return a.only ? -1 : 1;
  });
};

loadTags();

const props = defineProps(["modelValue", "title"]);
const emit = defineEmits(["update:modelValue"]);

const tags = computed({
  get() {
    return props.modelValue;
  },
  set(newTags) {
    emit("update:modelValue", newTags);
  },
});

const add = (value, isOnly = false) => {
  let tempTags = [...tags.value];

  // 既に登録されているかどうか
  const index = tempTags.indexOf(value);
  if (index !== -1) {
    // 同じものが登録されているのでそのタグをremoveする。onlyチェックは不要
    tempTags = [...tempTags.filter((i) => i !== value)];
  } else {
    // onlyがaddされた場合、tagsからonly:trueを除外する。
    if (isOnly === true) {
      const onlyTags = shortcuts.value
        .filter((i) => i?.only === true)
        .map((i) => i.searchName);

      tempTags = removeOnlyTag(tempTags, onlyTags);
    }
    // 新しいタグを追加する
    tempTags.push(value);
  }

  emit("update:modelValue", tempTags);
};

const removeOnlyTag = (arr1, arr2) => {
  const set2 = new Set(arr2);
  return arr1.filter((element) => !set2.has(element));
};

const selected = computed(() => (arg, isOnly) => {
  return Object.values(tags.value).includes(arg)
    ? isOnly
      ? "warning"
      : "primary"
    : isOnly
    ? "secondary"
    : "";
});

const tagsJson = computed(() => {
  return JSON.stringify(tags.value);
});

const updateTags = (newTags) => {
  console.info(tags.value, newTags);
  tags.value = newTags;
};
</script>
