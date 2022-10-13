<script setup>
import { computed, onMounted, ref } from 'vue';
import { getProperty, getTimeStamp, random } from '../helpers';
import GameBar from './GameBar.vue';
import IconReplay from '../assets/replay.svg?component';

/** Variables */
const player = ref(null);
const obstacles = ref([]);
const obstaclesRefs = ref([]);
const isPaused = ref(true);
const isGameOver = ref(false);
const isJumping = ref(false);
const jumpCount = ref(0);
const distance = ref(0);
const timer = ref(0);
const playTime = ref(0);
const score = computed(() => String(distance.value).padStart(5, '0'));
const formattedPlayTime = computed(() => {
  const minutes = Math.floor(playTime.value / 60);
  const seconds = playTime.value % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`;
});

/** Mounted */
onMounted(() => {
  // Keyevents
  window.addEventListener('keydown', ({ key }) => {
    // Enter
    if (key === 'Enter' && isPaused.value) {
      play();
    }

    // Jump
    if (key === 'ArrowUp' && !isJumping.value && !isPaused.value) {
      jump();
    }
  });
});

// Touch
window.addEventListener('touchend', () => {
  jump();
});

/** Methods */
let i = 0;
function draw() {
  if (isPaused.value) {
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
      color: 'var(--color-blue-base)',
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
      elLeft + elWidth > 15 &&
      elLeft + 10 <= playerWidth &&
      elHeight - 15 > playerBottom;

    // Collision
    if (hasCollided) {
      isPaused.value = true;
      isGameOver.value = true;
      window.clearInterval(timer.value);
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
    if (!isPaused.value) {
      isJumping.value = false;
    }
  }, 500);
}

function play() {
  obstacles.value = [];
  obstaclesRefs.value = [];
  isGameOver.value = false;
  isJumping.value = false;
  isPaused.value = false;
  distance.value = 0;
  jumpCount.value = 0;
  playTime.value = 0;
  window.requestAnimationFrame(draw);
  timer.value = window.setInterval(() => playTime.value++, 1000);
}
</script>

<template>
  <div class="game">
    <GameBar
      :items="{ Zeit: formattedPlayTime, Jumps: jumpCount, Punkte: score }"
    />

    <div v-if="isPaused" class="center">
      <template v-if="isGameOver">
        <span>Game Over</span>
        <button type="button" class="restart" aria-label="Replay" @click="play">
          <IconReplay width="16" height="16" />
        </button>
      </template>
      <template v-else>
        <button type="button" @click="play">Start</button>
      </template>
    </div>

    <div class="screen">
      <div
        ref="player"
        :class="['player', { jump: isJumping, freeze: isPaused }]"
      />

      <div
        v-for="{ id, height, width, color } of obstacles"
        :ref="(el) => obstaclesRefs.push({ id, el })"
        :key="id"
        :class="['obstacle', { freeze: isPaused }]"
        :style="`--width: ${width}px; --height: ${height}px; --color: ${color};`"
      />
    </div>
  </div>
</template>

<style scoped>
.game {
  overflow: hidden;
  position: relative;
  max-width: var(--screen-width);
  background-color: var(--color-blue-light);
  border-bottom: 5px solid var(--color-blue-base);
  border-radius: 5px;
  margin: 0 auto;
}

.screen {
  width: var(--screen-width);
  height: var(--screen-height);
}

.player {
  animation: run 0.2s steps(2) infinite;
  background: url('../assets/player.svg') no-repeat;
  background-size: 100% auto;
  position: absolute;
  bottom: 0;
  width: var(--player-width, 50px);
  height: var(--player-height, 65px);
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
  background: url('../assets/player-jump.svg') no-repeat;
}

.freeze {
  animation-play-state: paused;
}

.center {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  text-transform: uppercase;
}

.center span {
  display: block;
  margin-bottom: 0.5rem;
}

@keyframes jump {
  30% {
    bottom: calc(var(--screen-height) / 2);
  }
  50% {
    bottom: 0;
  }
}

@keyframes move {
  to {
    left: calc(var(--width) * -1);
  }
}

@keyframes run {
  100% {
    background-position: 0 -130px;
  }
}
</style>
