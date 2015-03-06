using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// CaseActionHandler 的摘要说明
    /// </summary>
    public class CaseActionHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string result = "";
            context.Response.ContentType = "text/plain";
            string act = context.Request["action"].Trim();
            switch (act)
            {
                case "addaction":
                    result = AddAction(context);
                    break;
                case "updateaction":
                    result = UpdateAction(context);
                    break;
                case "getlistbyid":
                    result = GetListById(context);
                    break;
                default:
                    break;
            }

            context.Response.Write(result);
        }

        private string AddAction(HttpContext context)
        {
            string result = "{\"success\":1}";

            DateTime? ActionDate = string.IsNullOrEmpty(context.Request["ActionDate"]) ? null : (DateTime?)DateTime.Parse(context.Request["ActionDate"].Trim());
            string ActionPersonal = context.Request["ActionPersonal"].ToString().Replace("\"", "\\\"");
            string ActionTalkContent = context.Request["ActionTalkContent"].Trim().Replace("\n", "\\n").Replace("\"", "\\\""); ;
            string ActionAnalysis = context.Request["ActionAnalysis"].Trim().Replace("\n", "\\n").Replace("\"", "\\\""); ;
            string eid = context.Request["eid"].Trim();
            string id = context.Request["ID"];
            try
            {
                CaseActionFacade.addAction(ActionDate, ActionPersonal, ActionTalkContent, ActionAnalysis, eid);
            }
            catch (Exception)
            {
                result = "{\"success\":0}";
            }
            return result;
        }
        private string UpdateAction(HttpContext context)
        {
            string result = "{\"success\":1}";
            DateTime? ActionDate = string.IsNullOrEmpty(context.Request["ActionDate"]) ? null : (DateTime?)DateTime.Parse(context.Request["ActionDate"].Trim());
            string ActionPersonal = context.Request["ActionPersonal"].ToString().Replace("\"", "\\\"");
            string ActionTalkContent = context.Request["ActionTalkContent"].ToString().Replace("\n", "\\n").Replace("\"", "\\\"");
            string ActionAnalysis = context.Request["ActionAnalysis"].ToString().Replace("\n", "\\n").Replace("\"", "\\\"");
            string eid = context.Request["eid"].Trim();
            string id = context.Request["ID"];
            try
            {
                if (string.IsNullOrEmpty(id) || id == "0")
                    CaseActionFacade.addAction(ActionDate, ActionPersonal, ActionTalkContent, ActionAnalysis, eid);
                else
                    CaseActionFacade.Update(int.Parse(id), ActionDate, ActionPersonal, ActionTalkContent, ActionAnalysis, eid);
            }
            catch
            {
                result = "{\"success\":0}";
            }
            return result;
        }
        private string GetListById(HttpContext context)
        {
            string result = "{\"success\":0}";
            string jsonData = "";
            string eid = context.Request["eid"].ToString();
            try
            {
                jsonData = CaseActionFacade.GetActionByEid(eid).ToJson();
                if (string.IsNullOrEmpty(jsonData))
                {
                    jsonData = "0";
                }
                result = "{\"success\":1,\"data\":" + jsonData + "}";
            }
            catch { }
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