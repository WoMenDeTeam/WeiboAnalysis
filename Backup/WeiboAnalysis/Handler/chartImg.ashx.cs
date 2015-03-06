using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using Svg;
using System.Drawing.Imaging;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// chartImg 的摘要说明
    /// </summary>

    public class chartImg : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            string result = SaveSvgToJpg(context);
            context.Response.Write(result);
            //string tType = context.Request.Form["type"].ToString();
            //string tSvg = context.Request.Form["svg"].ToString();
            //string tFileName = context.Request.Form["filename"].ToString();

            //MemoryStream tData = new MemoryStream(Encoding.UTF8.GetBytes(tSvg));
            //MemoryStream tStream = new MemoryStream();
            //string tTmp = new Random().Next().ToString();
            //string tWidth = context.Request.Form["width"].ToString();
            ////Svg.SvgDocument tSvgObj = SvgDocument.Open(tData);
            ////tSvgObj.Draw().Save(tStream, ImageFormat.Jpeg);

            //string path = "";
            //string tExt = "";
            //string tTypeString = "";
            //string filename = "";
            //switch (tType)
            //{
            //    case "image/png":
            //        tTypeString = "-m image/png";
            //        tExt = "png";
            //        break;
            //    case "image/jpeg":
            //        tTypeString = "-m image/jpeg";
            //        tExt = "jpg";
            //        break;
            //}
            //if (tTypeString != "")
            //{
            //    Svg.SvgDocument tSvgObj = SvgDocument.Open(tData);
            //    filename = tFileName + DateTime.Now.Ticks.ToString() + "." + tExt;
            //    path = context.Server.MapPath("~/template/" + filename);
            //    switch (tExt)
            //    {
            //        case "jpg":
            //            tSvgObj.Draw().Save(tStream, ImageFormat.Jpeg);
            //            break;
            //        case "png":
            //            tSvgObj.Draw().Save(tStream, ImageFormat.Png);
            //            break;
            //    }
            //}

            //string imgPath = "/template/" + filename;//http://123.103.15.153:8388/template/" + filename;
            //imgPath = "http://" + context.Request.Url.Authority + imgPath;
            //System.Drawing.Bitmap bitmapImg = new System.Drawing.Bitmap(tStream);
            //bitmapImg.Save(path);
            //RreportFacade.AddReport("", "", "", "", "", tTmp, "", "", "", imgPath, "", "");
            //context.Response.ClearContent();
            //context.Response.ClearHeaders();
            //context.Response.ContentType = tType;
            //context.Response.AppendHeader("Content-Disposition", "attachment; filename=" + tFileName + "." + tExt + "");

            //context.Response.BinaryWrite(tStream.ToArray());
            //context.Response.End();
        }
        public string SaveSvgToJpg(HttpContext context)
        {
            string result = "{\"success\":0}";
            try
            {
                string tSvg = context.Request.Form["svg"].ToString();
                MemoryStream tData = new MemoryStream(Encoding.UTF8.GetBytes(tSvg));
                MemoryStream tStream = new MemoryStream();
                string tTmp = new Random().Next().ToString();
                Svg.SvgDocument tSvgObj = SvgDocument.Open(tData);
                tSvgObj.Draw().Save(tStream, ImageFormat.Jpeg);
                System.Drawing.Bitmap bitmapImg = new System.Drawing.Bitmap(tStream);
                string fileName = DateTime.Now.Ticks.ToString() + ".jpg";
                string imgPath = "/template/" + fileName;
                string httpImgPath = "http://" + context.Request.Url.Authority + imgPath;
                bitmapImg.Save(context.Server.MapPath(imgPath), ImageFormat.Jpeg);
                RreportFacade.AddReport("", "", "", "", "", tTmp, "", "", "", httpImgPath, "", "");
                result = "{\"success\":1}";
            }
            catch (Exception e)
            {
            }
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