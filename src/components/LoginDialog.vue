<template>
  <div class="text-center">
    <v-dialog v-model="open" width="500" persistent>
      <slot />
    </v-dialog>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});
</script>
