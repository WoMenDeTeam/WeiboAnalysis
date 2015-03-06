using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// AccidentReportHandler 的摘要说明
    /// </summary>
    public class AccidentReportHandler : IHttpHandler
    {
        public string[] Encode = { "Title", "Content", "Url", "Department" };

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            //operating
            string switch_on = context.Request["action"];
            string result = "{\"success\":1,\"errormsg\":\"\"}";
            try
            {
                switch (switch_on)
                {
                    case "getpage":
                        result = GetPage(context);
                        break;
                    case "getAlarmCount":
                        result = GetAlarmCount(context);
                        break;
                    case "deletestate":
                        result = Delete(context);
                        break;
                    case "readstate":
                        result = Read(context);
                        break;
                    case "add":
                    case "update":
                        result = Update(context);
                        break;
                    case "revocation":
                        result = Revocation(context);
                        break;

                    default:
                        break;
                }
            }
            catch (Exception e)
            {
                result = string.Format("\"success\":0,\"errormsg\":\"{0}\"", e.ToString());
            }

            context.Response.Write(result);
        }


        public string Add(HttpContext context)
        {
            string resutl = "";
            return resutl;
        }

        //标记删除
        public string Delete(HttpContext context)
        {
            return UpdateState(context, -2);
        }
        //标记已读
        public string Read(HttpContext context)
        {
            return UpdateState(context, -1);
        }
        public string UpdateState(HttpContext context, int state)
        {
            string resutl = "{\"success\":1,\"errormsg\":\"\"}";
            string ids = context.Request["ids"] == null ? "0" : context.Request["ids"].ToString();
            AccidentReportFacade.DeleteByid(ids, state);
            return resutl;
        }
        public string GetPage(HttpContext context)
        {

            string result = "";
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            String pageWhere = context.Request["where"];
            String pageOrderBy = context.Request["orderBy"];
            string stime = context.Request["starttime"];
            string etime = context.Request["endtime"];
            string keywordtext = context.Request["keywordtext"];

            string area = context.Request["area"];
            string department = context.Request["department"];
            string level = context.Request["level"];

            string filed = string.IsNullOrEmpty(context.Request["filed"]) ? "PublishTime" : context.Request["filed"];
            pageWhere += string.IsNullOrEmpty(stime) ? "" : string.Format(" AND {1} >='{0}'", stime, filed);
            pageWhere += string.IsNullOrEmpty(etime) ? "" : string.Format(" AND {1} <='{0}'", etime, filed);

            if (!string.IsNullOrEmpty(keywordtext))
            {
                string[] words = keywordtext.Trim().ToLower().Replace(',', ' ').Split(' ');
                foreach (var item in words)
                {
                    pageWhere += string.Format(" AND Title like '%{0}%'", item);
                }
            }
            pageWhere += string.IsNullOrEmpty(area) ? "" : string.Format(" AND Area like '%{0}%'", area);
            pageWhere += string.IsNullOrEmpty(department) ? "" : string.Format(" AND RegulatoryDepartment like '%{0}%'", department);
            pageWhere += string.IsNullOrEmpty(level) ? "" : string.Format(" AND AccidentLevel like '%{0}%'", level);


            string jsonData = AccidentReportFacade.GetPageList(pageWhere, pageOrderBy, Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson(Encode);
            int totalCount = AccidentReportFacade.GetTotalCount(pageWhere);
            jsonData = jsonData == null ? "[]" : jsonData;
            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            return result;

        }
        public string GetAlarmCount(HttpContext context)
        {
            string lastTime = DateTime.Now.ToString();
            string result = "";
            string jsonData = "[]";
            bool isLasttime = false;
            string where = " State=0 And LEN(Title)>5 ";
            string where1 = " State =0 And LEN(Title)>5  ";
            if (context.Request["lastTime"] != null && context.Request["lastTime"] != "")
            {
                where += " And PublishTime >'" + context.Request["lastTime"] + "' ";
                isLasttime = true;
            }
            int count = 0;
            if (isLasttime)
            {
                count = AccidentReportFacade.GetTotalCount(where);
            }
            int allCount = AccidentReportFacade.GetTotalCount(where1);
            if (allCount > 0)
            {
                jsonData = GetLatestAlarmInfo("State in(0)");
            }
            return result = "{\"success\":1,\"data\":" + jsonData + ",\"allCount\":" + allCount + ",\"Count\":" + count + ",\"lasttime\":\"" + lastTime + "\"}";
        }
        public string GetLatestAlarmInfo(string where)
        {
            return AccidentReportFacade.GetLatestAlarm(where).ToJson(Encode);
        }

        public string Revocation(HttpContext context)
        {
            string result = "";
            int state = string.IsNullOrEmpty(context.Request["state"]) ? 0 : Convert.ToInt32(context.Request["state"]);
            result = UpdateState(context, 0);
            return result;
        }
        public string Update(HttpContext context)
        {
            string resutl = "{\"success\":1,\"errormsg\":\"\"}";
            string id = string.IsNullOrEmpty(context.Request["ID"]) ? "0" : context.Request["ID"].ToString();
            string title = context.Request["Title"].ToString();
            string content = context.Request["Content"].ToString();
            string url = context.Request["Url"].ToString();
            string departmentarea = context.Request["Department"].ToString();
            string state = string.IsNullOrEmpty(context.Request["State"]) ? "0" : context.Request["State"].ToString();
            string publishtime = string.IsNullOrEmpty(context.Request["PublishTime"]) ? DateTime.Now.ToString() : context.Request["PublishTime"];
            string createtime = string.IsNullOrEmpty(context.Request["CreateTime"]) ? DateTime.Now.ToString() : context.Request["CreateTime"];
            string occurrencetime = string.IsNullOrEmpty(context.Request["OccurrenceTime"]) ? null : context.Request["OccurrenceTime"];
            string accidentlevel = context.Request["AccidentLevel"];
            string area = context.Request["Area"];
            string regulatorydepartment = context.Request["RegulatoryDepartment"];
            AccidentReportFacade.ReoprtOperating(id, title, content, url, departmentarea, state, publishtime, createtime, occurrencetime, accidentlevel, regulatorydepartment, area, context.Request["action"]);
            return resutl;
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