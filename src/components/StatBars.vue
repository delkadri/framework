<script setup lang="ts">
defineProps<{
  title: string
  items: Array<{ label: string; value: number }>
}>()
</script>

<template>
  <section class="stats-panel">
    <h2>{{ title }}</h2>
    <div v-if="items.length" class="bars">
      <div v-for="item in items" :key="item.label" class="bar-row">
        <span>{{ item.label }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.max(8, item.value / Math.max(...items.map(({ value }) => value)) * 100)}%` }" />
        </div>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
    <p v-else class="muted">Aucune donnee.</p>
  </section>
</template>
