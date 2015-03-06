using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// OperatingLogHandler 的摘要说明
    /// </summary>
    public class OperatingLogHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string switch_on = context.Request["act"];
            string result = "";
            switch (switch_on)
            {
                case "add":
                    result = Add(context);
                    break;
                case "del":
                    break;
                case "getpagelist":
                    result = GetPageList(context);
                    break;
                default:
                    break;
            }
            context.Response.Write(result);
        }
        public string Add(HttpContext context)
        {
            string result = "{\"success\":1}";
            try
            {
                string userName = Util.ConfigUtil.CacheUsreInfo.UserName();
                string url = context.Request["url"];
                string machineIp = context.Request.UserHostAddress;
                string hostName = System.Net.Dns.GetHostName();
                System.Net.IPAddress[] address = System.Net.Dns.GetHostAddresses(hostName);
                if (machineIp.IndexOf('.') <= 0)
                    foreach (System.Net.IPAddress item in address)
                    {
                        string ip1 = item.ToString();
                        if (ip1.IndexOf('.') > 0)
                        {
                            machineIp = ip1;
                        }
                    }
                OperatingLogFacade.Add(userName, machineIp, 1, url, "");
            }
            catch
            {

                result = "{\"success\":0}";
            }
            return result;
        }
        public void Delete(HttpContext context)
        {
            int id = Convert.ToInt32(context.Request["id"].ToString());
            OperatingLogFacade.Del(id);
        }
        public string GetPageList(HttpContext context)
        {
            string result = "{\"success\":0}";
            string jsonData = "";
            int totalCount = 1;
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            String pageWhere = " Operation >0"; //context.Request["where"];

            String pageOrderBy = context.Request["orderBy"];
            jsonData = OperatingLogFacade.GetPage(pageWhere, null, pageOrderBy, Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson();
            totalCount = OperatingLogFacade.GetTotCount(pageWhere);

            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
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