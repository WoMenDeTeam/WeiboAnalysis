using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BLL.Idol;
using System.Text;

namespace WeiboAnalysis
{
    public partial class ExportToExcel : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BLL.Idol.QueryParamEntity paramEntity = QueryParamsDao.GetEntity(Context);
                IdolQuery exportQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
                paramEntity.PageSize = 3;
                exportQuery.queryParamsEntity = paramEntity;
                var list = exportQuery.GetResultList();
                string fname = Request["fname"];
                MyExportToExcel(list, fname);
            }
        }
        public void MyExportToExcel(IList<IdolNewsEntity> list, string Title)
        {
            HttpResponse resp = Response;// context.Response;  //System.Web.HttpContext.Current.Response;
            string ExcelName = Title + DateTime.Now.ToString("ddHHmmss");
            resp.ContentEncoding = System.Text.Encoding.GetEncoding("UTF-8");
            string fileName = "";
            if (Request.UserAgent.IndexOf("Firefox") < 0)
                fileName = string.Format("attachment;filename={0}", HttpUtility.UrlEncode(Title, Encoding.UTF8));
            else
                fileName = string.Format("attachment;filename={0}", Title);
            resp.AppendHeader("Content-Disposition", "attachment;filename=" + ExcelName + ".xls");
            resp.ContentType = "application/ms-excel";

            //取得数据表各列标题，各标题之间以t分割，最后一个列标题后加回车符 
            //resp.Write("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /></head><body><table border=1><tr ");
            //添加网格
            System.Text.StringBuilder strApp = new System.Text.StringBuilder();
            strApp.Append("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\">");
            strApp.Append("<head>");
            strApp.Append(" <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />");
            strApp.Append(" <!--[if gte mso 9]>");
            strApp.Append(" <xml>");
            strApp.Append(" <x:ExcelWorkbook>");
            strApp.Append(" <x:ExcelWorksheets>");
            strApp.Append(" <x:ExcelWorksheet>");
            strApp.Append(" <x:Name>123</x:Name>");
            strApp.Append(" <x:WorksheetOptions>");
            strApp.Append(" <x:Print>");
            strApp.Append(" <x:ValidPrinterInfo />");
            strApp.Append("</x:Print>");
            strApp.Append("</x:WorksheetOptions>");
            strApp.Append("</x:ExcelWorksheet>");
            strApp.Append("</x:ExcelWorksheets>");
            strApp.Append("</x:ExcelWorkbook>");
            strApp.Append("</xml>");
            strApp.Append("<![endif]-->");
            strApp.Append("</head>");

            strApp.Append("<body>");

            strApp.Append("<table>");
            strApp.Append("<tr>");
            //resp.Write("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />" +             "<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>123</x:Name><x:WorksheetOptions><x:Print><x:ValidPrinterInfo /></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table><tr ");
            strApp.Append("<th>用户名</th><th>微博地址</th><th>微博内容</th><th>发布时间</th><th>微博来源</th>");
            strApp.Append("</tr>");
            foreach (IdolNewsEntity item in list)
            {
                strApp.Append("<tr>");
                strApp.AppendFormat("<td>{0}</td>", item.AuthorName);
                strApp.AppendFormat("<td>{0}</td>", item.WeiboUrl);
                strApp.AppendFormat("<td>{0}</td>", item.AllContent);
                strApp.AppendFormat("<td>{0}</td>", item.TimeStr);
                strApp.AppendFormat("<td>{0}</td>", item.SiteName);
                strApp.Append("</tr>");
            }
            strApp.Append("</table>");
            strApp.Append("</body>");
            strApp.Append("</html>");
            resp.Write(strApp.ToString());
            resp.End();

        }
    }
}