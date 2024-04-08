<template>
  <div>
    <p>
      <NIcon class="icon" :component="AddressCard" />
      <span> {{ domain.admin_email }}</span>
    </p>
    <p>
      <NIcon class="icon" :component="Server" />
      <span> {{ domain.main_dns }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { type Domain } from "../../stores/domains";
import { NIcon } from "naive-ui";
import { AddressCard, Server } from "@vicons/fa";
defineProps<{
  domain: Domain;
}>();
</script>

<style scoped>
div {
  display: block;
}

span {
  padding-left: 0.5em;
}

.icon {
  transform: translateY(2px);
}
</style>