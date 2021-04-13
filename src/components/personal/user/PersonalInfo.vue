<template>
  <div>
    <v-cibrnav></v-cibrnav>
    <div style="width: 100%;height: 88vh;">
      <div style="background: white;width: 60%;margin-left: 20%;text-align: left;
      margin-top: 20px;min-height: 500px;border-radius: 10px;padding: 20px 10px">
        <h3>{{$t("personal")}}</h3>
        <Divider />
        <Split v-model="leftSize" style="height: 100%">
          <div slot="trigger"></div>
          <div slot="left" class="">
            <Menu :active-name="activeName" style="height: 100%;width: 100%;" @on-select="changeMenu">
              <MenuItem name="personalInfo">
                <Icon type="ios-contact"/>
                {{ $t("setting.personalInfo") }}
              </MenuItem>
              <MenuItem name="editPwd">
                <Icon type="md-eye" />
                {{ $t("setting.editPwd") }}
              </MenuItem>
              <MenuItem name="messageSetting">
                <Icon type="ios-chatboxes" />
                {{ $t("setting.messageSetting") }}
              </MenuItem>
              <MenuItem name="forBack">
                <Icon type="ios-clipboard" />
                {{ $t("setting.forBack") }}
              </MenuItem>
            </Menu>
          </div>
          <div slot="right" class="demo-split-pane">
            <user-info v-if="activeName === 'personalInfo'"></user-info>
            <edit-password v-if="activeName === 'editPwd'"></edit-password>
            <notice-manage v-if="activeName === 'messageSetting'"></notice-manage>
          </div>
        </Split>
      </div>
    </div>
  </div>
</template>

<script>
import VCibrnav from "@/components/public/v-cibrnav";
import UserInfo from "@/components/personal/user/userInfo";
import EditPassword from "@/components/personal/user/editPassword";
import NoticeManage from "@/components/personal/user/noticeManage";

export default {
  name: "PersonalInfo",
  components: {NoticeManage, EditPassword, UserInfo, VCibrnav},
  data : function (){
    return{
      leftSize : 0.2,
      activeName : "personalInfo"
    }
  },
  methods : {
  changeMenu : function (name){
    console.log(name);
    this.activeName = name;
  }
}
}
</script>

<style scoped>
.demo-split-pane{
  padding: 10px;
}
</style>