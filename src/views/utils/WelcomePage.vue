<template>
  <!--  -->
  <div class="flex h-full v__welcome-page justify-center items-center">
    <div class="coffees">
      <div class="coffee">
        <img :src="imgs[0]" alt="" />
      </div>
      <div class="coffee">
        <img :src="imgs[2]" alt="" />
      </div>
      <div class="coffee">
        <img :src="imgs[1]" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import c1 from '/@/assets/img/coffee01.jpg';
import c2 from '/@/assets/img/coffee02.jpg';
import c3 from '/@/assets/img/coffee03.jpg';

const imgs: any = [c1, c2, c3];
</script>

<style scoped lang="scss">
.coffees {
  display: flex;
}

.coffee {
  box-shadow: 8px 8px 16px 2px rgba(0, 0, 0, 0.24);
  border-radius: 16px;
  overflow: hidden;
  width: 300px;
  height: 400px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.dark .coffee {
  box-shadow: 8px 8px 16px 2px rgba(255, 255, 255, 0.24);
}

// .coffee {
//   width: 300px;
//   height: 400px;
// }

.coffee:nth-child(1) {
  transform: translateX(20%) scale(0.8);
}

.coffee:nth-child(2) {
  z-index: 1;
}

.coffee:nth-child(3) {
  transform: translateX(-20%) scale(0.8);
}
</style>
