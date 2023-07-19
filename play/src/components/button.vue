<template>
  <div class="mb-4">
    <el-button tag="div" text>Default</el-button>
    <el-button text type="primary">Primary</el-button>
    <el-button text type="success">Success</el-button>
    <el-button text type="info">Info</el-button>
    <el-button text type="warning">Warning</el-button>
    <el-button text type="danger">Danger</el-button>
  </div>
  <div class="mb-4">
    <el-button>Default</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button plain>Plain</el-button>
    <el-button type="primary" plain>Primary</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" plain>Info</el-button>
    <el-button type="warning" plain>Warning</el-button>
    <el-button type="danger" plain>Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button round>Round</el-button>
    <el-button type="primary" round>Primary</el-button>
    <el-button type="success" round>Success</el-button>
    <el-button type="info" round>Info</el-button>
    <el-button type="warning" round>Warning</el-button>
    <el-button type="danger" round>Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button circle>Round</el-button>
    <el-button circle type="primary" round>1</el-button>
    <el-button circle type="success" round>2</el-button>
    <el-button circle type="info" round>3</el-button>
    <el-button circle type="warning" round>4</el-button>
    <el-button circle type="danger" round>5</el-button>
  </div>

  <div class="mb-4">
    <el-button disabled>Default</el-button>
    <el-button type="primary" disabled>Primary</el-button>
    <el-button type="success" disabled>Success</el-button>
    <el-button type="info" disabled>Info</el-button>
    <el-button type="warning" disabled>Warning</el-button>
    <el-button type="danger" disabled>Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button plain disabled>Plain</el-button>
    <el-button type="primary" plain disabled>Primary</el-button>
    <el-button type="success" plain disabled>Success</el-button>
    <el-button type="info" plain disabled>Info</el-button>
    <el-button type="warning" plain disabled>Warning</el-button>
    <el-button type="danger" plain disabled>Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button :icon="Search" circle />
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </div>

  <div class="mb-4">
    <el-button size="large" round>Large</el-button>
    <el-button round>Default</el-button>
  </div>

  <div class="mb-4">
    <el-button type="primary" loading>
      <template #loading>
        <div class="custom-loading">
          <svg class="circular" viewBox="-10, -10, 50, 50">
            <path
              class="path"
              d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
              style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
            />
          </svg>
        </div>
      </template>
      Loading
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
</script>

<style scoped>
.el-button .custom-loading .circular {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  animation: loading-rotate 2s linear infinite;
}
.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}
</style>
