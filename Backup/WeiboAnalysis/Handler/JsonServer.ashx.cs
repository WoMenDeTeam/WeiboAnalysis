using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Configuration;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// kuayu 的摘要说明
    /// </summary>
    public class kuayu : IHttpHandler
    {
        //JsonFileHost
        public void ProcessRequest(HttpContext context)
        {
            string hostIp = ConfigurationManager.AppSettings["JsonFileHost"].ToString();
            string fileId = context.Request.QueryString["fileId"];
            string host = "http://" + hostIp + "/json/" + fileId + "/newrayjson.json";

            WebClient webc = new WebClient();
            webc.BaseAddress = host;
            webc.Encoding = System.Text.UTF8Encoding.UTF8;
            //var s = webc.DownloadData("http://123.103.15.153:8388/json/53/newrayjson.txt");
            var s2 = webc.DownloadString(host);
            context.Response.Write(s2);
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