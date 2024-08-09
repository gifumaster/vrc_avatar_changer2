<template>
  <v-dialog v-model="open" class="v-dialog_custom" scrollable>
    <slot />
  </v-dialog>
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

<style scoped>
.v-dialog_custom {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
