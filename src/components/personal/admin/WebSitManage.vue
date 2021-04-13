<template>
  <div style="width: 100%;height: 95vh">
    <Card style="width:100%">
      <div style="text-align:left;width: 30%;display: inline-block;">
        <h3>{{ $t("webSit.urlManager") }}</h3>
      </div>
      <div style="position: absolute;right: 20px;display: inline-block;">
        <Button icon="md-add" type="primary" @click="addNewWebSit">{{ $t("add") }}</Button>
      </div>
    </Card>
    <i-table border stripe :columns="cols" :data="webs">

      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>

      <template slot-scope="{ row }" slot="url">
        <Tag @click.native="gotoUrl(row.url)">{{ row.url }}</Tag>
      </template>

      <template slot-scope="{ row }" slot="imgUrl">
        <div style="width: 58px;height:58px;">
          <img v-if="row.imgurl != ''" :src="webImage(row.imgurl)"
               style="width: 100%;">
        </div>
      </template>

      <template slot-scope="{ row }" slot="desc">
        <strong>{{ row.descriptions }}</strong>
      </template>

      <template slot-scope="{ row }" slot="statu">
        <Tag color="success" v-if="row.curstatu == '00'">{{ "运行中" }}</Tag>
        <Tag color="warning" v-if="row.curstatu == '01'">{{ "停止运行" }}</Tag>
        <Tag color="error" v-if="row.curstatu == '09'">{{ "废弃" }}</Tag>
      </template>

      <template slot-scope="{ row }" slot="action">
          <i-button @click="editWebsit(row)">{{ $t("edit") }}</i-button>&nbsp;
          <Poptip
              style="z-index: 99999"
              confirm
              placement="top-end"
              :transfer="true"
              title="Are you sure you want to delete this item?"
              @on-ok="deleteOk(row)">
            <i-button type="error">{{ $t("delete") }}</i-button>
          </Poptip>
      </template>
    </i-table>
    <v-loading :show="loading"></v-loading>

    <Modal
        v-model="showAdd"
        :title="$t('add')"
        @on-ok="ok"
        @on-cancel="cancel">
      <i-form ref="newWebsit" :model="newWebsit" :rules="ruleWebsit" :label-width="100">
        <FormItem :label="$t('webSit.name')" prop="name">
          <Input v-model="newWebsit.name" placeholder="Enter websit name"/>
        </FormItem>
        <FormItem :label="$t('webSit.englishName')" prop="englishname">
          <Input v-model="newWebsit.englishname" placeholder="Enter websit english name"/>
        </FormItem>
        <FormItem :label="$t('webSit.url')" prop="url">
          <Input v-model="newWebsit.url" placeholder="Enter your name"/>
        </FormItem>
        <FormItem :label="$t('webSit.desc')" prop="descriptions">
          <Input v-model="newWebsit.descriptions" placeholder="Enter your name"/>
        </FormItem>
        <FormItem :label="$t('webSit.englishDesc')" prop="englishdesc">
          <Input v-model="newWebsit.englishdesc" placeholder="Enter your name"/>
        </FormItem>
        <FormItem :label="$t('webSit.imgUrl')" prop="imgurl">
          <Upload
              ref="upload"
              name="webImg"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              type="drag"
              :action="$axios.defaults.baseURL + 'file/upload'"
              style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20" v-if="newWebsit.imgurl == ''"></Icon>
              <img v-if="newWebsit.imgurl != ''" :src="imgUrl"
                   style="width: 100%;">
            </div>
          </Upload>
        </FormItem>
      </i-form>
    </Modal>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";

export default {
  name: "WebSitManage",
  components: {VLoading},
  data: function () {
    return {
      cols: [],
      webs: [],
      loading: false,
      showAdd: false,
      actionFlag : "",
      actionTitle : "",
      defaultList: [],
      editId: "",
      tempWeb : {},
      newWebsit: {
        name: "",
        englishname: "",
        url: "",
        descriptions: "",
        englishdesc: "",
        imgurl: ""
      },
      ruleWebsit: {
        name: [
          {required: true, message: 'The name cannot be empty', trigger: 'blur'}
        ],
        englishname: [
          {required: true, message: 'The english name cannot be empty', trigger: 'blur'}
        ],
        url: [
          {required: true, message: 'The url cannot be empty', trigger: 'blur'},
          {type: 'url', message: 'Incorrect url format', trigger: 'blur'}
        ],
        descriptions: [
          {required: true, message: 'The description cannot be empty', trigger: 'blur'}
        ],
        englishdesc: [
          {required: true, message: 'The english description cannot be empty', trigger: 'blur'}
        ],
        imgurl: [
          {required: true, message: 'The image cannot be empty', trigger: 'blur'}
        ]
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    editWebsit :function (row){
      this.actionFlag = "edit";
      this.actionTitle = this.$t("edit");
      this.newWebsit = JSON.parse(JSON.stringify(row));
      this.showAdd = true;
    },
    deleteOk : function (row){
      console.log(row);
    },
    editCancel:function (){

    },
    gotoUrl: function (url) {
      window.open(url);
    },
    ok: function () {
      var _this = this;
      if (this.actionFlag === "add"){
        this.$refs["newWebsit"].validate((valid) => {
          if (valid) {
            _this.loading = true;
            var postData = {
              web: JSON.stringify(_this.newWebsit)
            }
            _this.$axios.post("/admin/submitNewWebsit", postData).then(function (res) {
              _this.loading = false;
              if (res.data.code != "success") {
                _this.$Message.error(_this.$t(res.data.code));
              } else {
                // window.location.reload();
                _this.initPage();
              }
            }).catch(function (res) {
              _this.loading = false;
              console.log(res);
              _this.$Message.error(_this.$t("err.systemErr"));
            })
          } else {
            _this.showAdd = true;
          }
        });
      }else {
        // 更新操作
        this.$refs["newWebsit"].validate((valid) => {
          if (valid) {
            _this.loading = true;
            var postData = {
              web: JSON.stringify(_this.newWebsit)
            }
            _this.$axios.post("/admin/updateWebsit", postData).then(function (res) {
              _this.loading = false;
              if (res.data.code != "success") {
                _this.$Message.error(_this.$t(res.data.code));
              } else {
                // window.location.reload();
                _this.initPage();
              }
            }).catch(function (res) {
              _this.loading = false;
              console.log(res);
              _this.$Message.error(_this.$t("err.systemErr"));
            })
          } else {
            _this.showAdd = true;
          }
        });
      }
    },
    cancel: function () {

    },
    handleMaxSize: function () {
      this.$Message.error(this.$t("err.imageTooBig"))
    },
    handleFormatError: function () {
      this.$Message.error(this.$t("err.imgTypeErr"));
    },
    handleSuccess: function (response) {
      this.$Message.success(this.$t("uploadSuccess"));
      console.log(response);
      this.newWebsit.imgurl = response.retMap.file.id;
    },
    addNewWebSit: function () {
      this.actionFlag = "add";
      this.actionTitle = this.$t("add");
      this.newWebsit = {
        name: "",
        englishname: "",
        url: "",
        descriptions: "",
        englishdesc: "",
        imgurl: ""
      };
      this.showAdd = true;
    },
    webImage : function (id){
      return this.$axios.defaults.baseURL + 'file/img/' + id;
    },
    initPage: function () {
      this.initCols();
      this.loading = true;
      var _this = this;
      this.$axios.get("/admin/webManagerInit").then(function (res) {
        console.log(res);
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.webs = res.data.retMap.websits;
        }
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      });
    },
    initCols: function () {
      var cols = new Array();
      // 网站名
      cols.push({
        title: this.$t("webSit.name"),
        slot: "name"
      });

      // 网站链接
      cols.push({
        title: this.$t("webSit.url"),
        slot: "url"
      });

      // 网站图片
      cols.push({
        title: this.$t("webSit.imgUrl"),
        slot: "imgUrl"
      });

      // 简介
      cols.push({
        title: this.$t("webSit.desc"),
        slot: "desc"
      });

      // 状态
      cols.push({
        title: this.$t("webSit.statu"),
        slot: "statu"
      });

      cols.push({
        title: this.$t("action"),
        slot: "action"
      })

      this.cols = cols;
    }
  },
  computed: {
    imgUrl: function () {
      return this.$axios.defaults.baseURL + 'file/img/' + this.newWebsit.imgurl
    }
  }
}
</script>

<style scoped>

</style>