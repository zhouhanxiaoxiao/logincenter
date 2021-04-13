<template>
  <div>
    <Card style="width:100%">
      <div style="text-align:left;width: 30%;display: inline-block;">
        <h3>{{ $t("user.manager") }}</h3>
      </div>
      <div style="position: absolute;right: 20px;display: inline-block;">
<!--        <Button icon="md-add" type="primary" @click="addNewUser">{{ $t("add") }}</Button>-->
      </div>
    </Card>
    <Table :columns="cols" :data="users" stripe border style="margin-bottom: 100px">

      <div slot="role" slot-scope="{row}">
        <tag v-for="item in row.roles" :key="item.id" closable @on-close="deleteRole(row.id,item.id)">{{ item.rolename }}</tag>
        <i-select v-model="row.newRole" @on-change="addNewRow(row)" placeholder="新增角色">
          <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.rolename }}</Option>
        </i-select>
      </div>

      <div slot-scope="{ row }" slot="group" >
        <Select v-model="row.groupid" @on-change="changeGroup(row)">
          <Option v-for="item in groups" :value="item.id" :key="item.id">{{ item.groupname }}</Option>
        </Select>
      </div>

    </Table>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
export default {
  name: "usermanager",
  components: {VLoading},
  data : function (){
    return {
      users : [],
      cols : [],
      groups : [],
      roles : [],
      loading : false
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    addNewRow : function (row){
      for (var item in row.roles){
        var tmp = row.roles[item];
        if (row.newRole == tmp.id){
          return;
        }
      }
      var psotData = {
        userId : row.id,
        roleId : row.newRole
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/addNewRole", psotData).then(function (res){
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.$Message.success(_this.$t("commitSuccess"))
          _this.initPage();
        }
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    deleteRole : function (userId, roleId){
      var psotData = {
        userId : userId,
        roleId : roleId
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/deleteRole", psotData).then(function (res){
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.$Message.success(_this.$t("commitSuccess"))
          _this.initPage();
        }
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    changeGroup :function (row){
      var _this = this;
      var psotData = {
        user : JSON.stringify(row)
      }
      this.loading = true;
      this.$axios.post("/admin/updateUser", psotData).then(function (res){
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.$Message.success(_this.$t("commitSuccess"))
          _this.initPage();
        }
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    initPage : function (){
      this.initCols();
      this.loading = true;
      var _this = this;
      this.$axios.get("/admin/getAllUser").then(function (res){
        _this.loading = false;
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.users = res.data.retMap.users;
          _this.groups = res.data.retMap.groups;
          _this.roles = res.data.retMap.roles;
        }
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      });
    },
    initCols : function (){
      var cols = new Array();
      cols.push({
        title : this.$t("user.name"),
        key : "name",
      });
      cols.push({
        title : this.$t("user.email"),
        key : "email"
      });
      cols.push({
        title : this.$t("user.role"),
        slot : "role"
      });
      cols.push({
        title : this.$t("user.group"),
        slot : "group"
      });
      this.cols = cols;
    }
  }
}
</script>

<style scoped>

</style>