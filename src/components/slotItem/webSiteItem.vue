<template>
  <Card class="web-item" @click.native="gotoUrl">
    <i-row>
      <i-col span="10">
        <div class="item-img" :style="{background : 'url(' +backImg + ') no-repeat'}">
        </div>
      </i-col>
      <i-col span="13" offset="1">
        <h6>{{ webName }}</h6>
        <div style="width: 100%;font-size: 12px;color: #e8eaec;margin-top: 10px;display: -webkit-box;
        overflow: hidden;text-overflow:ellipsis;-webkit-line-clamp: 3;-webkit-box-orient: vertical;">
          {{ webDesc }}
        </div>
      </i-col>
    </i-row>
  </Card>
</template>

<script>

export default {
  name: "webSiteItem",
  props: {
    webItem: Object
  },
  beforeMount() {

  },
  methods : {
    gotoUrl : function (){
      window.open(this.webItem.url);
    }
  },
  computed : {
    webName : function (){
      if (localStorage.getItem("local") === "en"){
        return this.webItem.englishname;
      }else {
        return this.webItem.name;
      }
    },
    backImg : function (){
      return this.$axios.defaults.baseURL + 'file/img/' + this.webItem.imgurl;
    },
    webDesc : function (){
      if (localStorage.getItem("local") === "en"){
        return this.webItem.englishdesc;
      }else {
        return this.webItem.descriptions;
      }
    }
  }
}
</script>

<style scoped>
.web-item {
  width: 100%;
  height: 120px;
  margin-bottom: 20px;
  border: none;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.item-img {
  height: 90px;
  width: 100%;
  overflow: hidden;
  border-radius: 5px;
  background : url("../../assets/ba.jpg") center repeat-x;
  background-size: contain !important;
}
</style>