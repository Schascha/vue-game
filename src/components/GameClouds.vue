<template>
  <div class="cloud" v-bind="$attrs" />
  <div class="cloud cloud-sm" v-bind="$attrs" />
  <div class="cloud cloud-xs" v-bind="$attrs" />
</template>

<style scoped>
.cloud {
  --cloud-delay: 1s;
  --cloud-height: 40px;
  --cloud-scale: 1;
  --cloud-speed: 35s;
  --cloud-top: 100px;
  --cloud-width: 100px;

  animation: animateCloud var(--cloud-speed) forwards linear infinite
    var(--cloud-delay);
  position: absolute;
  top: var(--cloud-top);
  left: 100%;
  background: var(--cloud-background);
  border-radius: 999em;
  height: var(--cloud-height);
  transform: scale(var(--cloud-scale));
  width: var(--cloud-width);
}

.cloud-sm {
  --cloud-delay: 5s;
  --cloud-scale: 0.7;
  --cloud-speed: 50s;
  --cloud-top: 50px;
}

.cloud-xs {
  --cloud-delay: 15s;
  --cloud-scale: 0.4;
  --cloud-speed: 80s;
  --cloud-top: 170px;
}

.cloud::after,
.cloud::before {
  background: inherit;
  content: '';
  position: absolute;
}

.cloud::after {
  border-radius: inherit;
  height: 80%;
  left: 15%;
  top: -40%;
  width: 30%;
}

.cloud::before {
  border-radius: inherit;
  width: 50%;
  height: 150%;
  right: 15%;
  top: -70%;
}

@keyframes animateCloud {
  to {
    left: calc(var(--cloud-width) * -1);
  }
}
</style>
