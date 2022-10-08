<script setup>
import { computed, onMounted, ref } from 'vue';

// Variables
const counter = ref(0);
const distance = ref(0);
const player = ref(null);
const obstacles = ref([]);
const obstaclesRefs = ref([]);
const jump = ref(false);
const gameOver = ref(false);
const score = computed(() => String(distance.value).padStart(5, '0'));

// Helpers
const _getProperty = (el, value) => {
  return (
    el && parseInt(window?.getComputedStyle(el)?.getPropertyValue(value), 10)
  );
};

const _random = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

onMounted(() => {
  // Keyevents
  window.addEventListener('keydown', ({ key }) => {
    if (jump.value || gameOver.value) {
      return;
    }

    jump.value = key === 'ArrowUp';
    window.setTimeout(() => {
      if (!gameOver.value) {
        jump.value = false;
      }
    }, 300);
  });

  // Update
  window.requestAnimationFrame(draw);
});

let i = 0;
function draw() {
  if (gameOver.value) {
    i = 0;
    return;
  }

  // Distance
  i++;
  i % 10 === 0 && distance.value++;

  // Create obstacle
  if (
    obstacles.value.length === 0 ||
    (i % 500 === 0 && obstacles.value.length < 3 && Math.random() < 0.5)
  ) {
    obstacles.value.push({
      id: `obstacle-${new Date().getTime()}`,
      height: _random([30, 40]),
      width: _random([30, 20]),
      color: _random(['#ffc188', '#02D1AC', '#0066ff', '#CC0078']),
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

    const bottom = _getProperty(player.value, 'bottom');
    const width = _getProperty(player.value, 'width');
    const elHeight = _getProperty(el, 'height');
    const elLeft = _getProperty(el, 'left');
    const elWidth = _getProperty(el, 'width');
    const hasCollided = elLeft > 0 && elLeft <= width && elHeight > bottom;
    const hasPassed = elLeft === elWidth * -1;

    // Collision
    if (hasCollided) {
      gameOver.value = true;
      return;
    }

    // Done
    if (hasPassed) {
      counter.value++;
      obstaclesRefs.value.splice(elIndex, 1);
      obstacles.value.splice(index, 1);
    }
  });

  window.requestAnimationFrame(draw);
}

function replay() {
  gameOver.value = false;
  obstacles.value = [];
  obstaclesRefs.value = [];
  counter.value = 0;
  distance.value = 0;
  jump.value = false;
  window.requestAnimationFrame(draw);
}
</script>

<template>
  <div class="highscore">
    <strong>Highscore</strong>
    <span>{{ score }}</span>
    <span>({{ counter }})</span>
  </div>
  <div class="game">
    <div class="gameOver" v-if="gameOver">
      Game Over <button type="button" @click="replay">Restart</button>
    </div>
    <div ref="player" :class="['player', { jump: jump, freeze: gameOver }]" />
    <div
      :ref="(el) => obstaclesRefs.push({ id: id, el: el })"
      :class="['obstacle', { freeze: gameOver }]"
      v-for="{ id, height, width, color } of obstacles"
      :key="id"
      :style="`--width: ${width}px; --height: ${height}px; --color: ${color};`"
    />
  </div>
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
  animation: jump 0.3s linear forwards;
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
  40% {
    bottom: calc(var(--screen-height) / 2);
  }
  65% {
    bottom: calc(var(--screen-height) / 2);
  }
}

@keyframes move {
  to {
    left: calc(var(--width) * -1);
  }
}
</style>
