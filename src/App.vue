<template>
  <div id="app">
    <input
      type="file"
      accept="image/jpg,image/png"
      ref="input"
      @change="changeHanlder"
    />
  </div>
</template>

<script>
import { metaMap2excel, canvas2metaMap } from "./utils/xlsx";

export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    changeHanlder(e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      this.$refs.input.value = "";
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function(e) {
        const url = e.target.result;
        const image = new Image();
        image.src = url;
        image.onload = function() {
          ["width", "height"].forEach(prop => {
            canvas[prop] = image[prop];
          });
          ctx.drawImage(image, 0, 0);
          const metaMap = canvas2metaMap(canvas);
          metaMap2excel(metaMap);
        };
      };
    }
  }
};
</script>
