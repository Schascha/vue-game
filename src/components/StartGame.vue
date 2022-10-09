<script setup>
import { computed, onMounted, ref } from 'vue';
import { getProperty, getTimeStamp, random } from '../helpers';

/** Variables */
const player = ref(null);
const obstacles = ref([]);
const obstaclesRefs = ref([]);
const isGameOver = ref(false);
const isJumping = ref(false);
const jumpCount = ref(0);
const distance = ref(0);
const score = computed(() => String(distance.value).padStart(5, '0'));

/** Mounted */
onMounted(() => {
  // Keyevents
  window.addEventListener('keydown', ({ key }) => {
    // Enter
    if (key === 'Enter' && isGameOver.value) {
      replay();
    }

    // Jump
    if (key === 'ArrowUp' && !isJumping.value && !isGameOver.value) {
      jump();
    }
  });

  // Update
  window.requestAnimationFrame(draw);
});

// Touch
window.addEventListener('touchend', () => {
  jump();
});

/** Methods */
let i = 0;
function draw() {
  if (isGameOver.value) {
    i = 0;
    return;
  }

  // Distance
  i++;
  i % 10 === 0 && distance.value++;

  // Create obstacle
  if (
    obstacles.value.length === 0 ||
    (i % 500 === 0 && obstacles.value.length < 3 && Math.random() < 0.85)
  ) {
    obstacles.value.push({
      id: `obstacle-${getTimeStamp()}`,
      height: random([30, 40]),
      width: random([30, 20]),
      color: random(['#ffc188', '#02D1AC', '#0066ff', '#CC0078']),
    });
  }

  // Check obstacles
  obstacles.value.forEach(({ id }, index) => {
    const elIndex = obstaclesRefs.value.findIndex(
      (obstacle) => obstacle.id === id
    );
    const el = obstaclesRefs.value[elIndex]?.el;

    if (!el) {
      return;
    }

    const playerBottom = getProperty(player.value, 'bottom');
    const playerWidth = getProperty(player.value, 'width');
    const elHeight = getProperty(el, 'height');
    const elLeft = getProperty(el, 'left');
    const elWidth = getProperty(el, 'width');
    const hasPassed = elLeft === -elWidth;
    const hasCollided =
      elLeft > -elWidth && elLeft <= playerWidth && elHeight > playerBottom;

    // Collision
    if (hasCollided) {
      isGameOver.value = true;
      return;
    }

    // Done
    if (hasPassed) {
      obstaclesRefs.value.splice(elIndex, 1);
      obstacles.value.splice(index, 1);
      jumpCount.value++;
    }
  });

  window.requestAnimationFrame(draw);
}

function jump() {
  isJumping.value = true;
  window.setTimeout(() => {
    if (!isGameOver.value) {
      isJumping.value = false;
    }
  }, 500);
}

function replay() {
  obstacles.value = [];
  obstaclesRefs.value = [];
  isGameOver.value = false;
  isJumping.value = false;
  distance.value = 0;
  jumpCount.value = 0;
  window.requestAnimationFrame(draw);
}
</script>

<template>
  <div class="highscore">
    <strong>Highscore</strong>
    <span>{{ score }}</span>
  </div>
  <div class="game">
    <div class="isGameOver" v-if="isGameOver">
      Game Over
      <button type="button" @click="replay">Restart</button>
    </div>
    <div
      ref="player"
      :class="['player', { jump: isJumping, freeze: isGameOver }]"
    />
    <div
      :ref="(el) => obstaclesRefs.push({ id, el })"
      :class="['obstacle', { freeze: isGameOver }]"
      v-for="{ id, height, width, color } of obstacles"
      :key="id"
      :style="`--width: ${width}px; --height: ${height}px; --color: ${color};`"
    />
  </div>
  <span>Jumps: {{ jumpCount }}</span>
</template>

<style scoped>
.game {
  overflow: hidden;
  position: relative;
  width: var(--screen-width);
  height: var(--screen-height);
  border: 1px solid #f1f1f1;
  margin: 0 auto;
}

.player {
  position: absolute;
  bottom: 0;
  width: var(--player-width);
  height: var(--player-height);
  background-color: #000;
}

.obstacle {
  animation: move var(--speed) linear forwards;
  position: absolute;
  bottom: 0;
  left: calc(var(--screen-width) - var(--width));
  width: var(--width);
  height: var(--height);
  background-color: var(--color);
  border-radius: 999em 999em 0 0;
}

.jump {
  animation: jump 1s ease forwards;
}

.freeze {
  animation-play-state: paused;
}

.highscore {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@keyframes jump {
  0% {
    transform: scale(1, 1);
  }
  10% {
    transform: scale(1.1, 0.9);
  }
  30% {
    transform: scale(0.9, 1.1);
    bottom: calc(var(--screen-height) / 2);
  }
  50% {
    transform: scale(1, 1);
    bottom: 0;
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes move {
  to {
    left: calc(var(--width) * -1);
  }
}
</style>
