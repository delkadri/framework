<script setup lang="ts">
import type { CatalogFilters } from '@/types/game'
import { genreOptions, orderingOptions, platformOptions } from '@/constants/filters'

const props = defineProps<{
  filters: CatalogFilters
}>()

const emit = defineEmits<{
  change: [filters: CatalogFilters]
}>()

function update(key: keyof CatalogFilters, value: string): void {
  emit('change', {
    ...props.filters,
    [key]: value,
  })
}
</script>

<template>
  <section class="filter-panel" aria-label="Filtres catalogue">
    <label>
      <span>Genre</span>
      <select :value="filters.genre" @change="update('genre', ($event.target as HTMLSelectElement).value)">
        <option v-for="option in genreOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </label>

    <label>
      <span>Plateforme</span>
      <select :value="filters.platform" @change="update('platform', ($event.target as HTMLSelectElement).value)">
        <option v-for="option in platformOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </label>

    <label>
      <span>Tri</span>
      <select :value="filters.ordering" @change="update('ordering', ($event.target as HTMLSelectElement).value)">
        <option v-for="option in orderingOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </label>
  </section>
</template>
