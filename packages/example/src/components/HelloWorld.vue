<script setup lang="ts">
import { helloWorld } from "../lib/index";

const message = helloWorld();
</script>

<template>
  <div>
    {{ message }}
  </div>
</template>
