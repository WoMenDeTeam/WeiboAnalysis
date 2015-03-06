using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Configuration;

namespace JsonServer
{
    public partial class jsonfile : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string path = ConfigurationManager.AppSettings["FILEPATH"].ToString();
            string fileName = Request.QueryString["fileName"];
            string jsonName = Request.QueryString["jsonName"];
            string callBackName = Request.QueryString["jsoncallback"];
            fileName = fileName == null ? "53" : fileName;
            jsonName = jsonName == null ? "trendResult.json" : jsonName;
            path += fileName.Trim() + @"\" + jsonName.Trim();
            string result = getJsonFile(path);
            string renderStr = callBackName + "(" + result + ")";
            Response.ContentType = "text/plain";
            Response.Write(renderStr);
            Response.End();
        }
        public string getJsonFile(string path)
        {
            string result = "";
            StreamReader rd = new StreamReader(path, System.Text.Encoding.Default);
            try
            {
                string input = rd.ReadToEnd();
                rd.Close();
                result = input;
            }
            catch
            {
                result = "alert('文件读取失败');";
            }
            return result;
        }
    }
}