<script setup lang="ts">
import { statusLabels, type GameStatus } from '@/types/game'

defineProps<{
  modelValue: GameStatus
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GameStatus]
}>()

const statuses = Object.entries(statusLabels) as Array<[GameStatus, string]>
</script>

<template>
  <label class="status-select">
    <span>Statut</span>
    <select :value="modelValue" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value as GameStatus)">
      <option v-for="[value, label] in statuses" :key="value" :value="value">{{ label }}</option>
    </select>
  </label>
</template>
