<template>
  <div class="g-image-upload">
    <viewer :images="images" :options="{url: 'data-src'}">
      <div class="_image" v-for="(image, index) in images" :key="index" v-loading="image.loading">
        <img :src="image.showUrl" :data-src="image.source" alt />
        <i v-if="!image.loading && !readOnly" class="el-icon-close" @click="()=>deleteHandel(index)"></i>
      </div>
      <label v-if="!readOnly && !(single && images.length > 0)" :for="currentId" class="_add-btn">
        <i class="el-icon-plus"></i>
        <input @change="fileChange" :id="currentId" type="file" />
      </label>
    </viewer>
  </div>
</template>
<script>
import OSSHelper from '../libs/ossHelper';
import Helper from '../libs/helper';
export default {
  name: 'GImageUpload',
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentId: Helper.getUUID(),
      images: []
    };
  },
  methods: {
    setImages (images) {
      this.images = images.filter(item => item.url).map(item => {
        return {
          ...item,
          showUrl: OSSHelper.getUrlSync(item.url, 200),
          source: OSSHelper.getUrlSync(item.url)
        };
      });
    },
    getImages () {
      return this.images.map(item => item.url);
    },
    deleteHandel (index) {
      this.images.splice(index, 1);
    },
    fileChange (e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        let index = this.images.length;
        this.images.push({
          url: '',
          showUrl: event.target.result,
          loading: true
        });
        OSSHelper.upload(e.target).then(d => {
          if (d !== 'fail') {
            this.images[index].url = d.url;
            this.images[index].showUrl = OSSHelper.getUrlSync(d.url, 200);
            this.images[index].source = OSSHelper.getUrlSync(d.url);
            this.images[index].loading = false;
          }
        });
      };
    }
  }
};
</script>

<style lang="scss">
.g-image-upload {
  display: flex;
  flex-direction: row;
  >div{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  ._image {
    height: 100px;
    width: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    border-radius: 4px;
    img {
      height: 100%;
      width: 100%;
      border-radius: 4px;
      border: 1px solid #f3f3f3;
      cursor: pointer;
      &:hover{
        border: 0;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
      }
    }
    .el-icon-close{
      position: absolute;
      top: -6px;
      right: -6px;
      background: red;
      color: white;
      border-radius: 50%;
      padding: 3px;
      font-size: 14px;
      &:hover{
        background: rgb(189, 26, 26);
        cursor: pointer;
      }
    }
  }
  ._add-btn {
    height: 100px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    i {
      font-size: 30px;
      color: #ddd;
    }
    &:hover {
      background: #f7f7f7;
      cursor: pointer;
    }
    input {
      display: none;
    }
  }
}
</style>