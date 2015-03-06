using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WeiboAnalysis.yiqitemporary
{
    public partial class Reportlist : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                bool ischeck = false;
                string backrul = "";
                if (Request.UrlReferrer != null)
                {
                    if (Request.UrlReferrer.DnsSafeHost == "10.16.6.100")
                    {
                        ischeck = true;
                    }
                    backrul = Request.UrlReferrer.DnsSafeHost;
                }
                if (!ischeck)
                {
                    Response.Redirect(string.Format("http://10.16.6.100:8000/login.html?backhost={0}&topage={1}", backrul, "http://10.16.6.182/yiqitemporaryReportlist.aspx"));
                }
            }

        }
    }
}