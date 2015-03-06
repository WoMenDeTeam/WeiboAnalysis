using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.IO;
using Util;

namespace WeiboAnalysis
{
    public partial class DownloadReport : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string fileName = Request["filename"];
            ExportDataGrid("application/ms-word", "报告" + fileName + ".doc");
        }
        public string OutDoc()
        {
            string fileName = Request["filename"];
            string path = Server.MapPath("template/" + fileName + ".html");
            string result = FileManage.ReadStr(path);
            return result;
            //Response.Write(result);
        }
        private void ExportDataGrid(string FileType, string FileName)
        {
            Response.Charset = "utf-8";
            Response.ContentEncoding = Encoding.UTF8;
            string fileName = "";
            if (Request.UserAgent.IndexOf("Firefox") < 0)
            {
                fileName = string.Format("attachment;filename={0}", HttpUtility.UrlEncode(FileName, Encoding.UTF8));
            }
            else
            {
                fileName = string.Format("attachment;filename={0}", FileName);
            }

            Response.AppendHeader("Content-Disposition", fileName);

            Response.ContentType = FileType;
            this.EnableViewState = false;
            string docStr = OutDoc();
            StringBuilder sb = new StringBuilder();
            sb.Append(docStr);
            StringWriter tw = new StringWriter(sb);
            HtmlTextWriter hw = new HtmlTextWriter(tw);
            Page.RenderControl(hw);
            Response.Write(tw.ToString());
            Response.End();
        }

    }
}