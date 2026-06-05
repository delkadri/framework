<template>
  <section class="empty-state">
    <div class="empty-icon" aria-hidden="true">◇</div>
    <slot />
    <div class="empty-actions">
      <slot name="actions" />
    </div>
  </section>
</template>
