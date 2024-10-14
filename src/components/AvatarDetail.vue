<template>
  <div class="area slideIn" :title="description">
    <img referrerpolicy="no-referrer" :src="props.thumbnailImageUrl" width="192px" height="144px">
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
  margin: 1px;
  padding: 0;
  width: 192px;
  height: 144px;
  background-position: center;
  background-size: 100%;
  border-radius: 5px;
  transition: background-size 0.2s;
}

.box{
  position: relative;
  margin: 1px;
  padding: 0;
  width: 250px;
  background-position: center;
  background-size: 100%;
  border-radius: 5px;
  transition: background-size 0.2s;
  background-color:#EFEFEF;
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
  border: 3px solid red;
  transition: background-size 0.2s;
}
</style>
