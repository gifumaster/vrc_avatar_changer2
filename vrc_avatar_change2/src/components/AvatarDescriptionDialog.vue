<template>
  <div class="text-center">
    <v-dialog v-model="open" width="500" height="200">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="localValue"
            label="Avatar Description"
          ></v-text-field>
          {{ avatarDescription }}
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="execute"> 更新する </v-btn>
          <v-btn color="secondary" text @click="cancel"> しない </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { watch, computed, ref } from "vue";

const props = defineProps([
  "modelValue",
  "avatarDescription",
  "updateDescription",
]);
const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.avatarDescription);
watch(
  () => props.avatarDescription,
  () => {
    localValue.value = props.avatarDescription;
  }
);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});

const execute = () => {
  props.updateDescription(localValue.value);
  emit("update:modelValue", false);
};
const cancel = () => {
  emit("update:modelValue", false);
};
</script>
