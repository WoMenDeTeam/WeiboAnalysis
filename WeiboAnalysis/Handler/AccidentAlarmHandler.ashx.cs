using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;
using System.Text.RegularExpressions;
using Util;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// AccidentAlarmHandler 的摘要说明
    /// </summary>
    public class AccidentAlarmHandler : IHttpHandler
    {
        public string[] Encode = { "Title", "Content", "Url" };
        public void ProcessRequest(HttpContext context)
        {
            string result = "{\"success\":0}";

            context.Response.ContentType = "text/plain";
            string act = context.Request["action"].ToString();
            switch (act)
            {
                case "getPage":
                    result = GetPage(context);
                    break;
                case "getPage2":
                    result = GetPage2(context);
                    break;
                case "getAlarmCount":
                    result = GetAlarmCount(context);
                    break;
                case "delalarm":
                    result = Delalarm(context);
                    break;
                case "delalarmbyids":
                    result = DelalarmByIds(context);
                    break;
                case "update":
                    result = UpdateEntity(context);
                    break;
                case "add":
                    result = AddEntity(context);
                    break;
                case "delete":
                    result = Delete(context);
                    break;
                case "deletebyids":
                    result = DeleteByIds(context);
                    break;
                case "addtag":
                    result = AddTag(context);
                    break;
                case "canceltag":
                    result = CancelTag(context);
                    break;
                case "counttaginfo":
                    result = CountTag(context);
                    break;
                case "taginfolist":
                    result = TagInfoList(context);
                    break;
                default:
                    break;
            }
            context.Response.Write(result);
        }

        public string Delete(HttpContext context)
        {
            //AccidentAlarmFacade.DeleteByID(context.Request["id"]);
            string id = context.Request["id"];
            AccidentAlarmFacade.UpdateAlarmState(Convert.ToInt32(id), -2);
            return "{\"success\":1,\"errormsg\":\"\"}";
        }
        public string DeleteByIds(HttpContext context)
        {
            string id = context.Request["ids"];
            AccidentAlarmFacade.UpdateAlarmState(id, -2);
            return "{\"success\":1,\"errormsg\":\"\"}";
        }

        public string Delalarm(HttpContext context)
        {
            string id = context.Request["id"];
            AccidentAlarmFacade.UpdateAlarmState(Convert.ToInt32(id), -1);
            return "{\"success\":1}";
        }
        public string DelalarmByIds(HttpContext context)
        {
            string id = context.Request["ids"];
            AccidentAlarmFacade.UpdateAlarmState(id, -1);
            return "{\"success\":1}";
        }
        /// <summary>
        /// 摘要：
        ///   实时检测是否出现新的预警信息
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public string GetAlarmCount(HttpContext context)
        {
            string lastTime = DateTime.Now.ToString();
            string result = "";
            string jsonData = "[]";
            bool isLasttime = false;
            string where = " AlarmState=0 And SourceType=0";
            string where1 = " AlarmState =0 And SourceType=0 ";
            if (context.Request["lastTime"] != null && context.Request["lastTime"] != "")
            {
                where += " And PublishTime >'" + context.Request["lastTime"] + "' ";
                isLasttime = true;
            }
            where += GetCookieCityTag(context);
            where1 += GetCookieCityTag(context);
            int count = 0;
            if (isLasttime)
            {
                count = AccidentAlarmFacade.GetTotalCount(where);
            }
            int allCount = AccidentAlarmFacade.GetTotalCount(where1);
            if (allCount > 0)
            {
                jsonData = GetLatestAlarmInfo(" SourceType=0 AND AlarmState in(-1,0)");
            }
            return result = "{\"success\":1,\"data\":" + jsonData + ",\"allCount\":" + allCount + ",\"Count\":" + count + ",\"lasttime\":\"" + lastTime + "\"}";
        }
        public string GetLatestAlarmInfo(HttpContext context)
        {
            string stime = context.Request["lastTime"];
            //string where = " AlarmState=0 ";
            return AccidentAlarmFacade.GetLatestAlarm(stime).ToJson(Encode);
        }
        public string GetLatestAlarmInfo(string where)
        {

            return AccidentAlarmFacade.GetLatestAlarm(where).ToJson(Encode);
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
            if (!string.IsNullOrEmpty(stime))
            {
                pageWhere += string.Format(" AND CreateTime>='{0}'", stime);
            }
            if (!string.IsNullOrEmpty(etime))
            {
                pageWhere += string.Format(" AND CreateTime<='{0}'", etime);
            }
            if (!string.IsNullOrEmpty(keywordtext))
            {
                string[] words = keywordtext.Trim().ToLower().Replace(',', ' ').Split(' ');
                foreach (var item in words)
                {
                    pageWhere += string.Format(" AND Title like '%{0}%'", item);
                }
            }
            pageWhere += GetCookieCityTag(context);
            string jsonData = AccidentAlarmFacade.GetPageList(pageWhere, pageOrderBy, Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson(Encode);
            int totalCount = AccidentAlarmFacade.GetTotalCount(pageWhere);
            jsonData = jsonData == null ? "[]" : jsonData;
            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            return result;
        }
        public string GetPage2(HttpContext context)
        {
            string result = "";
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            String pageWhere = context.Request["where"];
            String pageOrderBy = context.Request["orderBy"];
            string stime = context.Request["starttime"];
            string etime = context.Request["endtime"];
            string keywordtext = context.Request["keywordtext"];
            if (!string.IsNullOrEmpty(stime))
            {
                pageWhere += string.Format(" AND CreateTime>='{0}'", stime);
            }
            if (!string.IsNullOrEmpty(etime))
            {
                pageWhere += string.Format(" AND CreateTime<='{0}'", etime);
            }
            pageWhere += GetCookieCityTag(context);
            string jsonData = AccidentAlarmFacade.GetPageList(pageWhere, pageOrderBy, Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson(Encode);
            int totalCount = AccidentAlarmFacade.GetTotalCount(pageWhere);
            jsonData = jsonData == null ? "[]" : jsonData;
            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            return result;
        }
        public string TagInfoList(HttpContext context)
        {
            string result = "";
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            String pageWhere = context.Request["where"];
            String pageOrderBy = context.Request["orderBy"];
            string stime = context.Request["starttime"];
            string etime = context.Request["endtime"];
            string keywordtext = context.Request["keywordtext"];
            if (!string.IsNullOrEmpty(stime))
            {
                pageWhere += string.Format(" AND CreateTime>='{0}'", stime);
            }
            if (!string.IsNullOrEmpty(etime))
            {
                pageWhere += string.Format(" AND CreateTime<='{0}'", etime);
            }
            if (!string.IsNullOrEmpty(keywordtext))
            {
                string[] words = keywordtext.Trim().ToLower().Replace(',', ' ').Split(' ');
                foreach (var item in words)
                {
                    pageWhere += string.Format(" AND Title like '%{0}%'", item);
                }
            }
            string jsonData = AccidentAlarmFacade.GetPageList(pageWhere, pageOrderBy, Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson(Encode);
            int totalCount = AccidentAlarmFacade.GetTotalCount(pageWhere);
            jsonData = jsonData == null ? "[]" : jsonData;
            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            return result;
        }



        public string UpdateEntity(HttpContext context)
        {

            string id = context.Request["ID"].ToString();
            string title = context.Request["Title"].ToString();
            string url = context.Request["Url"].ToString();
            string deadCount = context.Request["DeadCount"].ToString();
            string isMassDeath = context.Request["IsMassDeath"].ToString();
            string injuredCount = context.Request["InjuredCount"].ToString();
            string lostCount = context.Request["LostCount"].ToString();
            AccidentAlarmFacade.UpdateEntity(id, Util.EncodeByEscape.GetUnEscapeStr(title), "", Util.EncodeByEscape.GetUnEscapeStr(url), deadCount, injuredCount, lostCount, isMassDeath);
            return "{\"success\":1}";
        }
        public string AddEntity(HttpContext context)
        {
            string id = context.Request["ID"].ToString();
            string title = context.Request["Title"].ToString();
            string url = context.Request["Url"].ToString();
            string deadCount = context.Request["DeadCount"].ToString();
            string isMassDeath = context.Request["IsMassDeath"].ToString();
            string injuredCount = context.Request["InjuredCount"].ToString();
            string lostCount = context.Request["LostCount"].ToString();
            AccidentAlarmFacade.AddEntity("", Util.EncodeByEscape.GetUnEscapeStr(title), "", Util.EncodeByEscape.GetUnEscapeStr(url), deadCount, injuredCount, lostCount, isMassDeath);
            return "{\"success\":1}";
        }
        public string AddTag(HttpContext context)
        {
            string id = context.Request["id"];
            string remark = context.Request["remark"];
            AccidentAlarmFacade.AddTag(Convert.ToInt32(id), 1, remark);
            return "{\"success\":1}";
        }
        public string CancelTag(HttpContext context)
        {
            string id = context.Request["id"];
            AccidentAlarmFacade.AddTag(Convert.ToInt32(id), 0, "");
            return "{\"success\":1}";
        }
        public string CountTag(HttpContext context)
        {
            string stime = context.Request["sTime"] == null ? "" : context.Request["sTime"].ToString();
            string etime = context.Request["eTime"] == null ? "" : context.Request["eTime"].ToString();
            string where = " Tag=1 ";
            //string keywordtext = context.Request["keywordtext"];
            if (!string.IsNullOrEmpty(stime))
            {
                where += string.Format(" AND CreateTime>='{0}'", stime);
            }
            if (!string.IsNullOrEmpty(etime))
            {
                where += string.Format(" AND CreateTime<='{0}'", etime);
            }
            int count = AccidentAlarmFacade.CountTagInfo(where);
            return "{\"success\":1,\"count\":" + count + "}";
        }
        public string GetCookieCityTag(HttpContext context)
        {
            string result = "";
            if (context.Request.Cookies["_ACCIDENTALARMTAG_"] != null)
            {
                result = context.Request.Cookies["_ACCIDENTALARMTAG_"].Value;
            }
            if (string.IsNullOrEmpty(result))
            {
                result = "";
            }
            else
            {
                result = " and " + DESEncrypt.Decrypt(result);
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