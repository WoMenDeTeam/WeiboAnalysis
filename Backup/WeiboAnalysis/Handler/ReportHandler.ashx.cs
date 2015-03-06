using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;
using VTemplate.Engine;
using System.Text;
using System.Web.SessionState;
using System.IO;
using System.Web.UI;
using Util;


namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// ReportHandler 的摘要说明
    /// </summary>
    public class ReportHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string result = "";
            string switch_on = context.Request["action"].ToLower();

            switch (switch_on)
            {
                case "addreport":
                    result = AddReport(context);
                    break;
                case "delreport":
                    result = DelReport(context);
                    break;
                case "getlistreport":
                    result = GetListToJson(context);
                    break;
                case "createreport":
                    result = CreateReport(context);
                    break;
                default:
                    break;
            }
            context.Response.Write(result);
        }

        //添加报告数据
        public string AddReport(HttpContext context)
        {
            int result = 0;
            string dreContent = context.Request["dreContent"].ToString().Replace("\n", "").Replace("\"", "“").Trim();
            result = RreportFacade.AddReport(context.Request["authorName"], dreContent, context.Request["forwardNum"], "", context.Request["profileImageUrl"], context.Request["reference"], context.Request["replyNum"], "", context.Request["siteName"], context.Request["thumbnailPic"], context.Request["timesTamp"], context.Request["url"]);
            string resultJson = "{\"success\":1,\"data\":" + result + "}";
            return resultJson;
        }
        //删除报告数据
        public string DelReport(HttpContext context)
        {
            string result = "{\"success\":1}";
            string strid = context.Request["ids"].ToString();
            if (strid != null)
            {
                string[] ids = strid.Split(',');
                for (int i = 0; i < ids.Length; i++)
                {
                    RreportFacade.DelReport(Convert.ToInt32(ids[i].ToString()));
                }
            }


            return result;
        }
        //获取报告数据
        public void GetListReport(HttpContext context)
        {
            RreportFacade.GetList();
        }
        public string GetListToJson(HttpContext context)
        {
            string result = "{\"success\":1,\"data\":\"\",\"count\":0}";
            string jsonD = RreportFacade.GetListTab("").ToJson();

            if (jsonD != null)
            {
                result = "{\"success\":1,\"data\":" + jsonD + ",\"count\":1}";
            }
            return result;
        }

        public string CreateReport(HttpContext context)
        {
            Dictionary<string, string> d = new Dictionary<string, string>();
            context.Session.Add("Lable", d);
            string fileName = DateTime.Now.Ticks.ToString();
            //fileName;
            string tempsPath = context.Server.MapPath("~/template/repotrtemps.html");
            string tempsToDocPath = context.Server.MapPath("~/template/" + fileName + ".html");
            TemplateDocument document = new TemplateDocument(tempsPath, Encoding.UTF8);
            var list = RreportFacade.GetList();
            document.SetValue("list", list);
            document.RenderTo(tempsToDocPath, Encoding.UTF8);
            //ExportDataGrid(context, "application/ms-word", fileName);
            string result = "{\"success\":1,\"data\":\"" + fileName + "\"}";
            return result;
        }

        private void ExportDataGrid(HttpContext context, string FileType, string FileName)
        {
            context.Response.Charset = "GB2312";
            context.Response.ContentEncoding = Encoding.GetEncoding("GB2312");
            context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(FileName, Encoding.UTF8).ToString());
            context.Response.ContentType = FileType;
            string docStr = OutDoc(FileName);
            StringBuilder sb = new StringBuilder();
            sb.Append(docStr);
            StringWriter tw = new StringWriter(sb);
            HtmlTextWriter hw = new HtmlTextWriter(tw);
            context.Response.Write(tw.ToString());
            context.Response.End();
        }
        public string OutDoc(string fileName)
        {
            string path = HttpContext.Current.Server.MapPath("~/template/" + fileName + ".html");
            string result = FileManage.ReadStr(path);
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