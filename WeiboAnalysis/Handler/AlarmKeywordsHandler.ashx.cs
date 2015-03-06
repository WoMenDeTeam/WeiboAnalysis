using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// AlarmKeywordsHandler 的摘要说明
    /// </summary>
    public class AlarmKeywordsHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            //参数
            String act = context.Request["act"];
            String retJson = string.Empty;
            String ID = context.Request["keyID"];
            String KeyName = context.Request["keyword"];
            String KeyType = context.Request["keytype"];

            String Tag = context.Request["tag"];
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];

            if (!String.IsNullOrEmpty(act))
            {
                try
                {
                    switch (act)
                    {
                        case "initKeywords":
                            int str = Convert.ToInt32(Start);
                            int pageSize = Convert.ToInt32(PageSize);
                            String pageWhere = context.Request["where"];
                            String pageOrderBy = context.Request["orderBy"];
                            int totalCount = AlarmKeywordsFacade.GetTotalCount(pageWhere);
                            retJson = AlarmKeywordsFacade.GetList(pageWhere, pageOrderBy, pageSize, str).ToJson(totalCount);
                            break;
                        case "update":
                            AlarmKeywordsFacade.Update(Convert.ToInt32(ID), KeyName, Convert.ToInt32(KeyType), Tag);
                            retJson = "{\"success\":1}";
                            break;
                        case "insert":
                            AlarmKeywordsFacade.Insert(KeyName, Tag, Convert.ToInt32(KeyType));
                            retJson = "{\"success\":1}";
                            break;
                        case "delete":
                            AlarmKeywordsFacade.Del(Convert.ToInt32(ID));
                            retJson = "{\"success\":1}";
                            break;
                    }
                    context.Response.Write(retJson);
                }
                catch (Exception e)
                {

                    context.Response.Write(e.ToString());
                }
            }
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