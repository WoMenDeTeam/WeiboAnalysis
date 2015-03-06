using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using Util;

namespace WeiboAnalysis
{
    public partial class _Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string SessionKey = ConfigurationManager.AppSettings["SessionKey"].ToString();
                HttpCookie Cookie = HttpContext.Current.Request.Cookies[SessionKey];
                if (Cookie == null)
                {
                    Response.Redirect("login.html");
                }
                else
                {
                    string[] userinfo = DESEncrypt.Decrypt(Cookie.Value.ToString()).Split('|');
                    if (string.IsNullOrEmpty(userinfo[1]))
                    {
                        Response.Redirect("login.html");
                    }
                    else
                    {
                        string path = userinfo[7];
                        Response.Redirect(path);
                    }
                }
            }
        }
    }
}
