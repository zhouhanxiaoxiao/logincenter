<template>
  <div>
    <Card style="width:100%">
      <div style="text-align:left;width: 30%;display: inline-block;">
        <h3>{{ $t("depart.manager") }}</h3>
      </div>
      <div style="position: absolute;right: 20px;display: inline-block;">
        <Button icon="md-add" type="primary" @click="addNewGroups">{{ $t("add") }}</Button>
      </div>
    </Card>
    <Table :columns="cols" :data="groups" stripe border style="margin-bottom: 100px">
      <div slot="name" slot-scope="{ row }">
        {{ row.groupname }}
      </div>
      <div slot="principal" slot-scope="{ row }">
        <Select v-model="row.groupadmin" @on-change="updateAdmin(row)">
          <Option v-for="item in row.users" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div slot="member" slot-scope="{ row }">
        <Tag v-for="item in row.users" :key="item.id">{{ item.name }}</Tag>
      </div>
    </Table>
    <v-loading :show="loading"></v-loading>
    <Modal
        v-model="addNewFlag"
        :title="$t('depart.newDepart')"
        @on-ok="commitNewDepart">
      <Form ref="formValidate" :model="newGroup" :label-width="100">
        <FormItem :label="$t('depart.name')" prop="groupname">
          <i-input v-model="newGroup.groupname" placeholder="Enter group name"/>
        </FormItem>
        <FormItem :label="$t('depart.englishName')" prop="englishName">
          <i-input v-model="newGroup.groupEng" placeholder="Enter group name"/>
        </FormItem>
        <FormItem :label="$t('depart.principal')" prop="groupadmin">
          <Select v-model="newGroup.groupadmin">
            <Option v-for="item in users" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('user.email')" prop="userEmail">
          <i-input v-model="newGroup.userEmail" placeholder="Enter your email"/>
        </FormItem>
        <FormItem :label="$t('user.name')" prop="userName">
          <i-input v-model="newGroup.userName" placeholder="Enter your name"/>
        </FormItem>
        <FormItem :label="$t('user.englishName')" prop="englishName">
          <i-input v-model="newGroup.englishName" placeholder="Enter your english name"/>
        </FormItem>
        <FormItem :label="$t('user.password')" prop="realPwd">
          <i-input v-model="newGroup.realPwd" placeholder="Enter your english name"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";

export default {
  name: "departmentManage",
  components: {VLoading},
  data: function () {
    // var _this = this;
    // const validateEmailCheck = (rule, value, callback) => {
    //   var reg = /^\w{3,}@cibr\.ac\.cn$/;
    //   var regnibs = /^\w{3,}@nibs\.ac\.cn$/;
    //   if (!reg.test(_this.user.email) && !regnibs.test(_this.user.email)) {
    //     callback(new Error(_this.$t("user.errEmail")));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      loading: false,
      cols: [],
      groups: [],
      users: [],
      addNewFlag: false,
      newGroup: {
        groupEng: "",
        groupname: "",
        groupadmin: "",
        englishName: "",
        userName: "",
        userEmail: "",
        userPwd: "",
        realPwd: ""
      },
      // newGroupRuler : {
      //   groupname : [
      //     {required: true, message: this.$t("depart.noName"), trigger: 'blur'},
      //   ],
      //   groupadmin : [
      //     {required: true, message: this.$t("depart.noAdmin"), trigger: 'blur'},
      //   ],
      //   userName: [
      //     {required: true, message: this.$t("user.noName"), trigger: 'blur'},
      //     {type: 'string', min: 2, message: this.$t("user.lessLengthName"), trigger: 'blur'}
      //   ],
      //   englishName: [
      //     {required: true, message: this.$t("user.noEnglishName"), trigger: 'blur'},
      //     {type: 'string', pattern: /^[ a-zA-Z]+$/, message: this.$t("user.lessLengthName"), trigger: 'blur'}
      //   ],
      //   realPwd: [
      //     {required: true, message: this.$t("user.noPassword"), trigger: 'blur'},
      //     {type: 'string', min: 8, message: this.$t("user.lessLengthPwd"), trigger: 'blur'}
      //   ],
      //   userEmail : [
      //     {required: true, message: this.$t("user.noEmail"), trigger: 'blur'},
      //     {validator: validateEmailCheck, trigger: 'blur'}
      //   ]
      // }
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    commitNewDepart: function () {
      var _this = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          _this.newGroup.userPwd = _this.$md5(_this.newGroup.realPwd);
          _this.loading = true;
          this.$axios.post("/admin/addNewGroup", _this.newGroup).then(function (res) {
            _this.loading = false;
            _this.addNewFlag = false;
            if (res.data.code != "success") {
              _this.$Message.error(_this.$t(res.data.code));
            } else {
              _this.initPage();
            }
          }).catch(function (res) {
            _this.loading = false;
            console.log(res);
            _this.$Message.error(_this.$t("err.systemErr"));
          })
        } else {
          _this.$Message.error(_this.$t("user.placeWrite"));
        }
      })
    },
    updateAdmin: function (group) {
      var postData = {
        group: JSON.stringify(group)
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/updateGroup", postData).then(function (res) {
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.initPage();
        }
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    addNewGroups: function () {
      this.addNewFlag = true;
    },
    initPage: function () {
      this.initCols();
      this.loading = true;
      var _this = this;
      this.$axios.get("/admin/getAllGroups").then(function (res) {
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.groups = res.data.retMap.groups;
          _this.users = res.data.retMap.users;
        }
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })

    },
    initCols: function () {
      var cols = new Array();
      cols.push({
        title: this.$t("depart.name"),
        slot: "name",
      });

      cols.push({
        title: this.$t("depart.principal"),
        slot: "principal",
      });

      cols.push({
        title: this.$t("depart.member"),
        slot: "member",
      });
      this.cols = cols;
    }
  }
}
</script>

<style scoped>

</style>