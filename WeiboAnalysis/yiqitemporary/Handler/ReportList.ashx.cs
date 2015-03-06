using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.yiqitemporary
{
    /// <summary>
    /// ReportList 的摘要说明
    /// </summary>
    public class ReportList : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string action = context.Request["action"];
            int start = Convert.ToInt32(context.Request["start"]);
            int pagesize = Convert.ToInt32(context.Request["page_size"]);
            string strwhere = context.Request["strwhere"];
            string strorder = context.Request["strorder"];
            string category = context.Request["category"];
            switch (action)
            {
                
                case "accidentreportlist":
                    context.Response.Write(AccidentReportFacade.GetPager(strwhere, strorder, pagesize, start));
                    break;
                default:
                    break;
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