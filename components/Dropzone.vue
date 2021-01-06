<template lang="pug">
  .box.dropzone.has-text-centered
    input.input-file(type="file" 
      multiple 
      @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" 
      accept="image/*")
    p Drop here, or click to select files
    .files
      .box.file.m-2.p-0(v-for="(file, i) in files" :style="{ backgroundImage: 'url(' + previews[i] + ')' }")
        //- figure.image
          img(:src="previews[i]" :onload="previewOnLoad(i)")
        //- div.is-overlay()
        .metadata
          .overlay.is-overlay
          .is-flex.is-flex-direction-column.is-justify-content-center.is-overlay.p-2
            .delete(@click="deleteFile(i)")
            p.f-name {{file.name}} 
            p.heading {{(file.size /1000/1000).toFixed(2)}} MB
</template>

<script>
export default {
  data() {
    return {
      files: [],
      previews: [],
    }
  },
  methods: {
    filesChange(_, files) {
      const deduplicated = Array.from(files).filter(
        ({ name }) => !this.files.map(({ name }) => name).includes(name)
      )
      this.files.push(...deduplicated)
      deduplicated.forEach((file) => {
        this.previews.push(URL.createObjectURL(file))
      })
    },
    previewOnLoad(i) {
      URL.revokeObjectURL(this.previews[i])
    },
    deleteFile(i) {
      this.files.splice(i, 1)
      this.previews.splice(i, 1)
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
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: visibility 0s, opacity 0.1s linear;
}

.file:hover .metadata {
  visibility: visible;
  opacity: 1;
}

.metadata .overlay {
  background-color: #fff;
  opacity: 85%;
}
</style>
