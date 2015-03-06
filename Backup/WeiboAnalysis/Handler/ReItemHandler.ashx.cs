using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;
using System.Data;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// ReItemHandler 的摘要说明
    /// </summary>
    public class ReItemHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string result = "{\"success\":0,\"data\":[]}";
            string switch_on = context.Request["action"];
            context.Response.ContentType = "text/plain";
            switch (switch_on)
            {
                case "getreitemlist":
                    result = GetItemList(context);
                    break;
                case "plcount":
                    result = GetPlCount(context);
                    break;
                default:
                    break;
            }
            if (string.IsNullOrEmpty(result))
            {
                result = "{\"success\":1,\"data\":[]}";
            }
            context.Response.Write(result);
        }
        public string GetItemList(HttpContext context)
        {
            string result = "";
            string Start = context.Request["start"];
            string PageSize = context.Request["page_size"];
            int pageNumber = Convert.ToInt32(Start);
            int pageSize = Convert.ToInt32(PageSize);
            string pageWhere = context.Request["where"];
            string pageOrderBy = context.Request["orderBy"];
            int totcount = ReItemFacade.GetTotalCount(pageWhere);
            string josnData = ReItemFacade.GetReItemList(pageWhere, pageOrderBy, pageSize, pageNumber).ToJson(totcount);
            return josnData;
            //return result = "{\"success\":0,\"data\":" + josnData + ",\"Count\":" + totcount + "}";
        }
        public string GetPlCount(HttpContext context)
        {
            string ids = context.Request["ids"].ToString();
            return ReItemFacade.PlCount(ids);
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