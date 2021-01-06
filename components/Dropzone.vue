<template lang="pug">
  .box.dropzone.has-text-centered
    input.input-file(type="file" 
      multiple 
      @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" 
      accept="image/*")
    p Drop here, or click to select files
    .files
      .box.file.m-2(v-for="(file, i) in files")
        .metadata
          .delete(@click="deleteFile(i)")
          .is-flex.is-flex-direction-column.is-justify-content-center.is-overlay.p-2
            p.f-name {{file.name}} 
            p.heading {{(file.size /1000/1000).toFixed(2)}} MB
</template>

<script>
export default {
  data() {
    return {
      files: [],
    }
  },
  methods: {
    filesChange(_, files) {
      this.files.push(...files)
    },
    deleteFile(i) {
      this.files.splice(i, 1)
    },
  },
}
</script>

<style scoped>
.dropzone {
  outline: 2px dashed grey;
  outline-offset: -10px;
  color: dimgray;
  min-height: 200px;
  position: relative;
  cursor: pointer;
  width: 100%;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}

.file {
  width: 128px;
  height: 128px;
  display: inline-block;
  position: relative;
}

.f-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 16em;
  overflow: hidden;
}

.delete {
  position: absolute;
  right: 10px;
  top: 10px;
}

.metadata {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.file:hover .metadata {
  display: block;
}

.test {
  height: 100%;
}
</style>
