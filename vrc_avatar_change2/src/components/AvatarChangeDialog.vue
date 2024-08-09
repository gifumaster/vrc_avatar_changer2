<template>
  <div class="text-center">
    <v-dialog v-model="open" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> </v-card-title>

        <v-card-text>
          <div style="width: 450px; height: 333px">
            <v-img
              max-width="450px"
              max-height="333px"
              aspect-ratio="4/3"
              cover
              :src="avatarImage"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </div>
          アバター「{{ avatarName }}」に変更しますか？
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
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

const execute = () => {
  props.changeAvatar();
  emit("update:modelValue", false);
};

const cancel = () => {
  emit("update:modelValue", false);
};
</script>
