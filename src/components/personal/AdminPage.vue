<template>
  <div class="demo-split" style="width: 100%;height: 100vh;background-color: white;overflow: hidden">
    <v-cibrnav></v-cibrnav>
    <Split v-model="leftSize" :min="0.15" :max="0.5">
      <div slot="left" class="demo-split-pane" style="text-align: left">
        <div style="height: 100vh;width: 100%;display: inline-block;overflow: auto">
          <Menu theme="dark" :active-name="activityName"
                style="width: 100%;height: 100%;" @on-select="changeMenu">
            <MenuGroup title="用户管理">
              <MenuItem name="depart">
                <Icon type="md-document"/>
                {{$t("webSit.groupManager")}}
              </MenuItem>
              <MenuItem name="userManager">
                <Icon type="md-chatbubbles"/>
                {{$t("webSit.userManager")}}
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="内容管理">
              <MenuItem name="webSite">
                <Icon type="md-heart"/>
                {{$t("webSit.urlManager")}}
              </MenuItem>
            </MenuGroup>
          </Menu>
        </div>
      </div>
      <div slot="right" class="demo-split-pane">
        <div class="right-container">
          <web-sit-manage v-if="activityName == 'webSite'"></web-sit-manage>
          <department-manage v-if="activityName == 'depart'"></department-manage>
          <usermanager v-if="activityName == 'userManager'"></usermanager>
        </div>
      </div>
    </Split>
  </div>
</template>

<script>
import WebSitManage from "@/components/personal/admin/WebSitManage";
import VCibrnav from "@/components/public/v-cibrnav";
import DepartmentManage from "@/components/personal/admin/departmentManage";
import Usermanager from "@/components/personal/admin/usermanager";
export default {
  name: "AdminPage",
  components: {Usermanager, DepartmentManage, VCibrnav, WebSitManage},
  data: function () {
    return {
      leftSize: 0.2,
      activityName : "depart"
    }
  },
  methods : {
    changeMenu : function (name){
      console.log(name);
      this.activityName = name;
    }
  },
}
</script>

<style scoped>
.right-container {
  width: 100%;
  height: 100vh;
  display: inline-block;
  overflow: auto;
  text-align: left;
  padding: 1% 2%;
}
</style>