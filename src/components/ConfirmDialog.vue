<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="dialog-backdrop" role="presentation" @click="$emit('cancel')">
        <section class="dialog" role="dialog" aria-modal="true" :aria-label="title" @click.stop>
          <h2>{{ title }}</h2>
          <p>{{ message }}</p>
          <div class="dialog-actions">
            <button type="button" class="ghost" @click="$emit('cancel')">Annuler</button>
            <button type="button" class="danger" @click="$emit('confirm')">Retirer</button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
