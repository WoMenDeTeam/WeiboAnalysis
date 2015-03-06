using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Util;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// CaseFileUploadHandler 的摘要说明
    /// </summary>
    public class CaseFileUploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            //string d = context.Server.MapPath;
            context.Response.ContentType = "text/plain";
            string result = "";
            string act = context.Request["action"].ToString();
            switch (act)
            {
                case "addfile":
                    result = AddFile(context);
                    break;
                case "update":
                    result = UploadFile(context);
                    break;
                case "getlist":
                    result = GetList(context);
                    break;
                default:
                    break;
            }
            context.Response.Write(result);

        }
        private string AddFile(HttpContext context)
        {
            string result = "{\"success\":0}";
            string eid = context.Request["eid"];
            if (string.IsNullOrEmpty(eid)) { return result; }
            try
            {
                string name = context.Request["name"];
                string fileName = SaveFil(context);
                if (string.IsNullOrEmpty(name))
                {
                    name = fileName.Substring(0, fileName.IndexOf('_'));
                }
                CaseFileUploadFacade.AddFile(name, fileName, int.Parse(eid));
                result = "{\"success\":1}";
            }
            catch { }

            return result;
        }
        private string UploadFile(HttpContext context)
        {
            string result = "{\"success\":0}";
            //string eid = context.Request["eid"];
            string id = context.Request["id"];
            if (string.IsNullOrEmpty(id)) { return result; }
            try
            {
                string name = context.Request["name"];
                string fileName = SaveFil(context);
                if (string.IsNullOrEmpty(name))
                {
                    name = fileName.Substring(0, fileName.IndexOf('_'));
                }
                CaseFileUploadFacade.UpdateFile(int.Parse(id), name, fileName);
                result = "{\"success\":1}";
            }
            catch { }
            return result;
        }

        private string GetList(HttpContext context)
        {
            string result = "{\"success\":0}";
            string eid = context.Request["eid"];
            try
            {
                string jsonData = CaseFileUploadFacade.GetFileList(int.Parse(eid)).ToJson();
                if (!string.IsNullOrEmpty(jsonData))
                {
                    result = "{\"success\":1,\"data\":" + jsonData + "}";
                }
            }
            catch { }
            return result;
        }
        private string SaveFil(HttpContext context)
        {
            string serverPath = "~/reportfile";
            int cout = context.Request.Files.Count;
            HttpPostedFile file = context.Request.Files[0];
            string extension = IOFile.Extension(file.FileName);
            string date = DateTime.Now.ToString("yyyyMMddHHmmss") + extension;
            string filename = file.FileName.Substring(0, file.FileName.IndexOf('.')) + "_" + date;
            IOFile.UploadFile(file, filename, serverPath);
            return filename;
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