<template>
  <div class="text-center">
    <v-dialog v-model="open" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> </v-card-title>

        <v-card-text>
          アバター「{{ avatarName }}」に変更しますか？
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <a :href="url" target="_blank"> VRChat </a>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="execute"> 変更する </v-btn>
          <v-btn color="secondary" text @click="cancel"> しない </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps([
  "modelValue",
  "changeAvatar",
  "avatarName",
  "avatarImage",
  "avatarId",
  "updateAvatar",
]);
const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});

const url = computed(() => {
  return 'https://vrchat.com/home/avatar/'+ props.avatarId
})

const execute = () => {
  props.changeAvatar();
  emit("update:modelValue", false);
};

const cancel = () => {
  emit("update:modelValue", false);
};

const updated = () => {
  props.updateAvatar();
  emit("update:modelValue", false);
}
</script>
