using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// CaseAccidentHandler 的摘要说明
    /// </summary>
    public class CaseAccidentHandler : IHttpHandler
    {


        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string result = "{\"success\":0}";
            string jsonData = "";
            string act = context.Request["action"].Trim();
            switch (act)
            {
                case "addnew":
                    jsonData = AddCase(context);
                    break;
                case "getlist":
                    jsonData = GetList(context);
                    break;
                case "del":
                    jsonData = DelCaseAccident(context);
                    break;
                case "upload":
                    jsonData = UpdateCaseAccident(context);
                    break;
                default:
                    break;
            }
            if (!string.IsNullOrEmpty(jsonData))
            {
                result = "{\"success\":1,\"data\":" + jsonData + "}";
            }
            context.Response.Write(result);
        }
        private string AddCase(HttpContext context)
        {
            string result = "";
            string caseName = context.Request["CaseName"].ToString().Trim();
            string pid = context.Request["pid"].ToString().Trim();
            CaseAccidentFacade.AddAccident(caseName, int.Parse(pid));
            result = CaseAccidentFacade.GetNewCaseAccidentId(caseName, int.Parse(pid)).ToJson();
            return result;
        }
        private string GetList(HttpContext context)
        {
            string pid = context.Request["pid"].Trim();
            return CaseAccidentFacade.GetListByPid(int.Parse(pid)).ToJson();
        }
        private string DelCaseAccident(HttpContext context)
        {
            string result = "{\"success\":1}";
            try
            {
                string id = context.Request["id"];
                CaseAccidentFacade.Delaccident(int.Parse(id));
            }
            catch (Exception)
            {
                result = "{\"success\":0}";

            }
            return result;
        }
        private string UpdateCaseAccident(HttpContext context)
        {
            string result = "{\"success\":1}";
            try
            {
                string id = context.Request["id"];
                string name = context.Request["CaseName"];
                //string pid = context.Request["pid"];
                CaseAccidentFacade.UpdateAccident(int.Parse(id), name);
                //CaseAccidentFacade.GetListByPid(int.Parse(pid)).ToJson();
            }
            catch (Exception)
            {
                result = "{\"success\":0}";
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