<template>
  <div class="area slideIn" :title="description">
    <img referrerpolicy="no-referrer" :src="props.thumbnailImageUrl" width="144px" height="144px">
    <div>{{ name }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailImageUrl: { type: String, required: true },
});

// const title = computed(() => props.name + "\n" + props.description);
const styles = computed(() => {
  return "background-image: url('" + props.thumbnailImageUrl + "')";
});
</script>

<style>
.area {
  position: relative;
  padding: 0;
  width: 146px;
  height: 146px;
  background-position: center;
  background-size: 100%;
  transition: background-size 0.2s;
}

.area img{
  opacity: 0.9;
}

.area div {
  font-size: 0.7rem;
  position: absolute;
  margin-right: 5px;
  right: 3px;
  bottom: 3px;
  text-overflow: ellipsis;
  text-shadow: 1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff,
    -1px -1px 0 #fff;
  transition: opacity 0.2s;
  opacity: 0.2;
  text-overflow: ellipsis;
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
}

.area:hover div {
  opacity: 1;
  right: 0;
  bottom: 0;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.area:hover {
  background-position: center;
  background-size: 120%;
  box-sizing: border-box;
  border: 1px solid red;
  transition: background-size 0.2s;
}

.area:hover img{
  opacity: 1;
}
</style>
