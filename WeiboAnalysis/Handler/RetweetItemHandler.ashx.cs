using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// RetweetItemHandler 的摘要说明
    /// </summary>
    public class RetweetItemHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string result = "";
            string switch_on = context.Request["action"];
            context.Response.ContentType = "text/plain";
            switch (switch_on)
            {
                case "getreitemlist":
                    result = GetItemList(context);
                    break;
                default:
                    break;
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
            int totcount = RetweetItemFacade.GetTotalCount(pageWhere);
            string josnData = RetweetItemFacade.GetReItemList(pageWhere, pageOrderBy, pageSize, pageNumber).ToJson(totcount);
            return josnData;
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