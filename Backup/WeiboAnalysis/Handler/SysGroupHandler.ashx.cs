using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// SysGroupHandler 的摘要说明
    /// </summary>
    public class SysGroupHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string result = "";
            try
            {
                string act = context.Request["action"].ToString().Trim().ToLower();
                switch (act)
                {
                    case "add":
                        result = AddGroup(context);
                        break;
                    case "update":
                        result = UpdateGroup(context);
                        break;
                    case "del":
                        result = DelGroup(context);
                        break;
                    case "getlist":
                        result = GetGroupList();
                        break;
                    case "getuser":
                        result = GetUser(context);
                        break;
                    case "updateusergroup":
                        result = UpdateUserGroup(context);
                        break;
                    case "delusergroup":
                        result = DelUserGroup(context);
                        break;
                    case "getlistuserbygroupid":
                        result = GetListUserByGroupid(context);
                        break;
                    case "setusergroup":
                        result = SetUserGroup(context);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception e)
            {

                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            //context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }

        private string AddGroup(HttpContext context)
        {
            string result = "{\"success\":1}";
            string gName = context.Request["groupName"].Trim();
            try
            {
                SysGroupFacade.AddGroup(gName);
            }
            catch (Exception)
            {
                result = "{\"success\":0}";
            }
            return result;
        }
        private string DelGroup(HttpContext context)
        {
            string result = "{\"success\":1}";
            try
            {
                int id = Convert.ToInt32(context.Request["id"].Trim());
                SysGroupFacade.DeleteGroup(id);
                FollowerEntityFacade.DeleteGroup(id);
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        private string UpdateGroup(HttpContext context)
        {
            string result = "{\"success\":1}";
            try
            {
                string name = context.Request["groupName"].Trim();
                int id = Convert.ToInt32(context.Request["id"].Trim());
                int index = Convert.ToInt32(context.Request["pindex"].Trim());
                SysGroupFacade.UpdateGroup(id, name, index);
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        private string GetGroupList()
        {
            string result = "{\"success\":1}";
            try
            {
                string strJson = SysGroupFacade.GetGroupList().ToJson();
                result = "{\"success\":1,\"data\":" + strJson + "}";
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        private string GetUser(HttpContext context)
        {
            string result = "";
            string id = context.Request["id"];
            string Start = context.Request["start"];
            string PageSize = context.Request["page_size"];
            //string pageWhere = context.Request["where"];
            string pageOrderBy = context.Request["orderBy"];
            string pageWhere = " GroupID=" + id;
            string jsonData = FollowerEntityFacade.GetJsonList(pageWhere,pageOrderBy, int.Parse(PageSize), int.Parse(Start)).ToJson();
            int totalCount = FollowerEntityFacade.GetTotalCount(pageWhere);
            if (!string.IsNullOrEmpty(jsonData))
            {
                result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            }
            else
            {
                result = "{\"success\":0,\"Count\":0}";
            }
            return result;
        }

        private string UpdateUserGroup(HttpContext context)
        {
            int id = 0, gid = 0;
            string result = "{\"success\":1}";
            if (!string.IsNullOrEmpty(context.Request["id"])) { id = Convert.ToInt32(context.Request["id"]); }
            if (!string.IsNullOrEmpty(context.Request["gid"])) { gid = Convert.ToInt32(context.Request["gid"]); }
            try
            {
                FollowerEntityFacade.UpdateFollowerGroup(id, gid);
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        private string SetUserGroup(HttpContext context)
        {
            string result = "{\"success\":1}";
            string ids = context.Request["ids"];
            string gid = context.Request["gid"];

            try
            {
                FollowerEntityFacade.SetUserGroup(Convert.ToInt32(gid), ids);
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        private string DelUserGroup(HttpContext context)
        {
            int id = 0, gid = 0;
            string result = "{\"success\":1}";
            if (!string.IsNullOrEmpty(context.Request["id"])) { id = Convert.ToInt32(context.Request["id"]); }
            FollowerEntityFacade.DeleteById(id);
            return result;
        }

        private string GetListUserByGroupid(HttpContext context)
        {
            int id = 0, gid = 0;
            string result = "{\"success\":1}";
            if (!string.IsNullOrEmpty(context.Request["id"])) { id = Convert.ToInt32(context.Request["id"]); }
            string strJson = FollowerEntityFacade.GetlistUserByGroupid(id);
            if (!string.IsNullOrEmpty(strJson))
            {
                result = "{\"success\":1,\"data\":" + strJson + "}";
            }
            return result;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}