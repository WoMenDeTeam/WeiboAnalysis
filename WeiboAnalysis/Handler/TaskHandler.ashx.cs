using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// TaskHandler 的摘要说明
    /// </summary>
    public class TaskHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string result = "";
            context.Response.ContentType = "application/json";
            string switch_on = context.Request["action"] == null ? "" : context.Request["action"].Trim();
            switch (switch_on)
            {
                case "addtask":
                    result = AddTask(context);
                    break;
                case "gettasklist":
                    result = GetTaskList(context);
                    break;
                case "usertasklist":
                    result = UserTaskList(context);
                    break;
                case "allocationinfo":
                    result = TaskAllocationInfo(context);
                    break;
                case "taskallocation":
                    result = TaskAllocation(context);
                    break;
                case "wcqk":
                    result = TaskCompletion(context);
                    break;
                case "completionsubmit":
                    result = CompletionSubmit(context);
                    break;
                case "gettaskinfo":
                    result = GetTaskInfo(context);
                    break;
                case "updatetask":
                    result = UpdateTaskInfo(context);
                    break;
                case "deletetask":
                    result = DeleteTaskInfo(context);
                    break;
                default:
                    break;
            }
            context.Response.Write(result);
        }
        public string CompletionSubmit(HttpContext context)
        {
            string result = "{\"success\":1,\"errormsg\":\"\"}";
            try
            {
                string id = context.Request["id"];
                string contentInfo = context.Request["contextinfo"].ToString();
                UserTaskFacade.UpdateUserTask(Convert.ToInt32(id), contentInfo);
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }
        //网络评员任务列表
        public string UserTaskList(HttpContext context)
        {
            //Util.ConfigUtil.CacheUsreInfo.UserID();
            string result = "";
            string success = "0";
            try
            {
                string userid = context.Request["UserID"].ToString();
                String start = context.Request["start"];
                String pageSize = context.Request["page_size"];
                String where = string.Format(" ut.ReceiverID='{0}' ", userid);
                String sTime = context.Request["STime"];
                String eTime = context.Request["ETime"];
                string isComplete = context.Request["IsWanCheng"];
                if (!string.IsNullOrEmpty(isComplete))
                {
                    where += string.Format(" AND ut.CompleteStatus='{0}' ", isComplete);
                }
                if (!string.IsNullOrEmpty(sTime))
                {
                    where += string.Format(" AND ut.StartTime>='{0}' ", sTime);
                }
                if (!string.IsNullOrEmpty(eTime))
                {
                    where += string.Format(" AND t.EndTime<='{0}' ", eTime);
                }

                String orderBy = " ut.StartTime desc";
                string jsonData = UserTaskFacade.GetTaskPage(where, orderBy, Convert.ToInt32(pageSize), Convert.ToInt32(start)).ToJson();
                int count = UserTaskFacade.GetCount(where);
                if (string.IsNullOrEmpty(jsonData))
                {
                    success = jsonData = "0";
                }
                result = "{\"success\":" + success + ",\"data\":" + jsonData + ",\"Count\":" + count + ",\"errormsg\":\"\"}";
            }
            catch (Exception e)
            {
                result = "{\"success\":" + success + ",\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }
        //任务完成情况
        public string TaskCompletion(HttpContext context)
        {
            string result = "";
            try
            {
                string id = context.Request["ID"];
                string jsonData = UserTaskFacade.GetUserTaskByTaskID(id).ToJson();
                if (jsonData == null)
                {
                    jsonData = "0";
                }
                result = "{\"success\":1,\"data\":" + jsonData + ",\"errormsg\":0}";

            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }
        //添加任务
        public string AddTask(HttpContext context)
        {
            string result = "{\"success\":1,\"msg\":\"\"}";
            try
            {
                TaskFacade.AddTask(context);
            }
            catch (Exception e)
            {
                result = "{\"success\":1,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }
        //获取任务列表
        public string GetTaskList(HttpContext context)
        {
            string result = "";
            try
            {
                String start = context.Request["start"];
                String pageSize = context.Request["page_size"];
                string iSAllocation = context.Request["ISAllocation"];
                string sendId = context.Request["SenderID"];
                String sTime = context.Request["STime"];
                String eTime = context.Request["ETime"];
                string where = string.Format("SenderID={0} ", sendId);
                if (!string.IsNullOrEmpty(iSAllocation))
                {
                    where += string.Format(" AND ISAllocation={0} ", iSAllocation);
                }
                if (!string.IsNullOrEmpty(sTime))
                {
                    where += string.Format(" AND CreateTime>='{0}' ", sTime);
                }
                if (!string.IsNullOrEmpty(eTime))
                {
                    where += string.Format(" AND EndTime<='{0}' ", eTime);
                }
                string jsonData = TaskFacade.GetTaskList(where, "", Convert.ToInt32(pageSize), Convert.ToInt32(start)).ToJson();
                string totalCount = TaskFacade.GetTotalCount(where).ToString();
                if (string.IsNullOrEmpty(jsonData))
                {
                    jsonData = "0";
                }
                result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }
        //任务分配情况
        public string TaskAllocationInfo(HttpContext context)
        {
            string result = "";
            string where = "ID={0}";
            string id = context.Request["ID"];
            where = string.Format(where, id);
            try
            {
                //任务信息
                string taskJson = TaskFacade.GetTaskByWhere(where).ToJson();
                //分配人信息
                string fpJson = UserTaskFacade.GetUserTaskByTaskID(id).ToJson();
                //未分配人信息
                string wfpJson = UserAccountsFacade.GetTackUser(id).ToJson();
                //string.IsNullOrEmpty(taskJson)
                fpJson = string.IsNullOrEmpty(fpJson) ? "0" : fpJson;
                wfpJson = string.IsNullOrEmpty(wfpJson) ? "0" : wfpJson;
                result = "{\"success\":1,\"taskinfo\":" + taskJson + ",\"fpuser\":" + fpJson + ",\"wfpuser\":" + wfpJson + "}";
            }
            catch (Exception e)
            {
                result = "{\"success\":1,\"errormsg\":" + e.ToString() + "}";
            }
            return result;

        }
        //任务分给用户
        public string TaskAllocation(HttpContext context)
        {
            string result = "{\"success\":1,\"errormsg\":0}";
            try
            {
                string id = context.Request["ID"];
                string[] userList = context.Request["userlist"].ToString().Split(',');
                for (int i = 0; i < userList.Length; i++)
                {
                    string userid = userList[i].Split('_')[0];
                    string userName = userList[i].Split('_')[1];
                    UserTaskFacade.AddUserTask(Convert.ToInt32(id), Convert.ToInt32(userid), userName);
                }
                TaskFacade.UpdateTaskStatus(id);
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        public string GetTaskInfo(HttpContext context)
        {
            string id = context.Request["id"].ToString();
            var entity = TaskFacade.GetTaskEntityById(int.Parse(id));
            return TaskFacade.TaskEntityToJson(entity);
        }
        public string UpdateTaskInfo(HttpContext context)
        {
            string id = context.Request["id"].ToString();
            var entity = TaskFacade.GetTaskEntityById(int.Parse(id));

            string url = context.Request["URL"].ToString();
            string decription = context.Request["Contents"].ToString();
            string etime = context.Request["EndTime"].ToString();
            entity.URL = url;
            entity.Contents = decription;
            entity.EndTime = DateTime.Parse(etime);
            TaskFacade.UpdateTask(entity);
            return "{\"success\":1,\"error\":\"\"}";
        }
        public string DeleteTaskInfo(HttpContext context)
        {
            string id = context.Request["id"].ToString();
            TaskFacade.DeleteTask(int.Parse(id));
            return "{\"success\":1,\"error\":\"\"}";
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