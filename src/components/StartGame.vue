<script setup>
import { onMounted, ref } from 'vue';

const counter = ref(0);
const player = ref(null);
const obstacle = ref(null);
const jump = ref(false);
const isAlive = ref(true);

onMounted(() => {
  window.addEventListener('keydown', ({ key }) => {
    if (jump.value === true) {
      return;
    }

    jump.value = key === 'ArrowUp';
    setTimeout(() => (jump.value = false), 300);
  });

  setInterval(() => {
    const top = parseInt(
      window?.getComputedStyle(player.value)?.getPropertyValue('top'),
      10
    );
    const left = parseInt(
      window?.getComputedStyle(obstacle.value)?.getPropertyValue('left'),
      10
    );
    const width = parseInt(
      window
        ?.getComputedStyle(document.documentElement, null)
        ?.getPropertyValue('--player-width'),
      10
    );

    if (left === 0) {
      counter.value++;
    }

    if (left < width && top >= 160) {
      counter.value = 0;
      isAlive.value = false;
    }
  }, 10);
});
</script>

<template>
  {{ counter }}
  <div class="game">
    <div ref="player" :class="['player', { jump: jump }]" />
    <div ref="obstacle" class="obstacle" />
  </div>
</template>

<style scoped>
.game {
  overflow: hidden;
  width: var(--screen-width);
  height: var(--screen-height);
  border: 1px solid black;
  margin: 0 auto;
}

.player {
  position: relative;
  top: calc(var(--screen-height) - var(--player-height));
  width: var(--player-width);
  height: var(--player-height);
  background-color: black;
}

.obstacle {
  animation: move 1.5s linear infinite;
  position: relative;
  top: calc(var(--screen-height) - var(--player-height) - var(--obstacle-height));
  left: calc(var(--screen-width) - var(--obstacle-width));
  width: var(--obstacle-width);
  height: var(--obstacle-height);
  background-color: red;
}

.jump {
  animation: jump 0.3s linear;
}

@keyframes jump {
  50% {
    top: calc(
      var(--screen-height) - var(--player-height) - (var(--screen-height) / 2)
    );
  }
}

@keyframes move {
  to {
    left: 0;
  }
}
</style>
