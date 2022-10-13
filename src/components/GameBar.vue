<script setup>
defineProps({
  items: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <dl class="bar">
    <div v-for="(item, index) in items" :key="index" class="item">
      <dt>{{ index }}</dt>
      <dd>{{ item }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.bar {
  transform: translate(-50%, 0);
  position: absolute;
  top: 0;
  left: 50%;
  display: flex;
  margin: 0;
  justify-content: center;
  background-color: var(--color-white);
  border-radius: 0 0 5px 5px;
  text-align: center;
}

.item {
  flex: 1 1 100%;
  position: relative;
  padding: 5px 20px;
  width: 90px;
}

.item + .item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  border-left: 1px solid var(--color-grey-light);
}

dt {
  font-size: 0.75rem;
  margin: 0;
  text-transform: uppercase;
}

dd {
  display: block;
  font-size: 0.875rem;
  font-weight: bold;
  margin: 0;
}
</style>
