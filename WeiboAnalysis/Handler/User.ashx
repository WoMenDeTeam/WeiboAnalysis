<%@ WebHandler Language="C#" Class="User" %>

using System;
using System.Web;
using System.Text;
using Util;
using System.Configuration;
using System.Web.SessionState;
using DBDAL.Entity;
using BLL.Facade;
public class User : IHttpHandler, IRequiresSessionState
{
    private static string SessionKey = ConfigurationManager.AppSettings["SessionKey"].ToString();
    public void ProcessRequest(HttpContext context)
    {
        string action = context.Request.Form["action"];
        if (!string.IsNullOrEmpty(action))
        {
            switch (action)
            {
                case "power":
                    context.Response.Write(CheckPower());
                    break;
                case "adduser":
                    context.Response.Write(AddUser(context));
                    break;
                case "updateuser":
                    context.Response.Write(UpdateUser(context));
                    break;
                case "deluser":
                    context.Response.Write(DelUser(context));
                    break;
                case "getuserlist":
                    context.Response.Write(GetUserList(context));
                    break;
                case "user_login":
                    context.Response.Write(UserLogin(context));
                    break;
                case "check_user":
                    context.Response.Write(CheckUser());
                    break;
                case "getorg":
                    context.Response.Write(GetOrg());
                    break;
                case "quit":
                    context.Response.Write(Quit(context));
                    break;
                case "updatepassword":
                    context.Response.Write(UpdatePassword(context));
                    break;
                case "getrole":
                    context.Response.Write(GetRole(context));
                    break;
                case "getuserrole":
                    context.Response.Write(getUserRole(context));
                    break;
                case "getuserinfo":
                    context.Response.Write(GetUserInfo());
                    break;
                case "addrole":
                    context.Response.Write(AddRole(context));
                    break;
                case "delrole":
                    context.Response.Write(DelRole(context));
                    break;
                case "updaterole":
                    context.Response.Write(UpdateRole(context));
                    break;
                case "getrolelist":
                    context.Response.Write(GetRoleList(context));
                    break;
                default:
                    break;
            }
        }
    }
    //添加权限
    private string AddRole(HttpContext context)
    {
        string result = "{\"success\":1,\"errormsg\":\"\"}";
        string roleName = context.Request["rolename"];
        if (!string.IsNullOrEmpty(roleName))
        {
            RoleFacade.AddRole(roleName);
        }
        else
        {
            result = "{\"success\":0,\"errormsg\":\"名字不可以为空!\"}";
        }

        return result;
    }
    private string UpdateRole(HttpContext context)
    {
        string result = "{\"success\":1,\"errormsg\":\"\"}";
        string id = context.Request["rid"].ToString();
        string roleName = context.Request["rolename"].ToString();
        RoleFacade.UpdateRole(Convert.ToInt32(id), roleName);
        return result;
    }
    private string DelRole(HttpContext context)
    {
        string result = "{\"success\":1,\"errormsg\":\"\"}";
        string id = context.Request["rid"].ToString();
        string where = string.Format(" RoleID={0} ", id);
        int rows = UserRoleFacade.GetTotalCount(where);
        if (rows == 0)
        {
            RoleFacade.DelRole(Convert.ToInt32(id));
        }
        else
        {
            result = "{\"success\":0,\"errormsg\":\"当前权限下有用户，不可删除!\"}";
        }

        return result;
    }
    //获取权限列表
    private string GetRole(HttpContext context)
    {
        string resultJson = RoleFacade.GetRoleList().ToJson();
        //        if(string.IsNullOrEmpty(resultJson))
        string result = "{\"success\":1,\"data\":" + resultJson + "}";
        return resultJson;
    }
    //获取用户权限
    private string getUserRole(HttpContext context)
    {
        string id = Util.ConfigUtil.CacheUsreInfo.UserID();
        if (id == null)
        {
            id = "0";
        }
        UserRoleEntity entity = UserRoleFacade.GetUserRoleByUserID(Convert.ToInt32(id));
        string result = "{\"success\":1,\"ID\":" + entity.UserRole.ID + ",\"RoleName\":\"" + entity.UserRole.RoleName + "\"}";
        return result;
    }

    private string UpdatePassword(HttpContext context)
    {
        string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
        string password = context.Request["password"].ToString();
        UserAccountsFacade.UpdatePassword(Convert.ToInt32(userid), password);
        return "{\"SuccessCode\":1}";
    }
    private string AddUser(HttpContext context)
    {
        string USERNAME = context.Request["USERNAME"];
        string PASSWORD = context.Request["PASSWORD"];
        string EMAIL = context.Request["EMAIL"];
        string MOBILE = context.Request["MOBILE"];
        string OrgTag = context.Request["OrgTag"];
        string Power = context.Request["Power"];
        string RoleId = context.Request["roleid"];
        string RealName = context.Request["RealName"];
        string DepartmentName = context.Request["DepartmentName"];

        UserAccountsFacade.AddUserAccount(0, USERNAME, PASSWORD, EMAIL, MOBILE, OrgTag, Convert.ToInt32(Power), RealName, DepartmentName);
        UserAccountsEntity entity = UserAccountsFacade.GetUser(USERNAME, PASSWORD, "anjian");
        //设置权限
        UserRoleFacade.AddUserRole(entity.USERID, Convert.ToInt32(RoleId));
        return "{\"SuccessCode\":1}";
    }
    private string UpdateUser(HttpContext context)
    {
        string USERID = context.Request["USERID"];
        string USERNAME = context.Request["USERNAME"];
        string PASSWORD = context.Request["PASSWORD"];
        string EMAIL = context.Request["EMAIL"];
        string MOBILE = context.Request["MOBILE"];
        string OrgTag = context.Request["OrgTag"];
        string Power = context.Request["Power"];
        string RoleId = context.Request["RoleID"];
        string RealName = context.Request["RealName"];
        string DepartmentName = context.Request["DepartmentName"];
        UserAccountsFacade.UpdateUserAccount(Convert.ToInt32(USERID), USERNAME, PASSWORD, EMAIL, MOBILE, OrgTag, Convert.ToInt32(Power), RealName, DepartmentName);
        UserAccountsEntity entity = UserAccountsFacade.GetUser(USERNAME, PASSWORD, "anjian");
        //设置权限
        UserRoleFacade.UpdateUserRole(entity.USERID, Convert.ToInt32(RoleId));


        return "{\"SuccessCode\":1}";
    }
    private string DelUser(HttpContext context)
    {
        string userid = context.Request["USERID"];
        UserAccountsFacade.DelUserAccount(Convert.ToInt32(userid));
        UserRoleFacade.DelByUserId(Convert.ToInt32(userid));
        return "{\"SuccessCode\":1}";
    }
    public string GetUserInfo()
    {
        string where = " ua.USERID= " + Util.ConfigUtil.CacheUsreInfo.UserID();
        return UserAccountsFacade.GetUserInfo(where).ToJson();
    }
    //getrolelist
    private string GetRoleList(HttpContext context)
    {
        string result = "{\"success\":0}";
        String Start = context.Request["start"];
        String PageSize = context.Request["page_size"];
        string jsonData = RoleFacade.GetPage("", "", Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson();
        int totalCount = RoleFacade.GetTotalCount("");
        result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
        return result;
    }
    private string GetUserList(HttpContext context)
    {
        //SELECT ur.RoleID, r.RoleName,ua.USERID,ua.USERNAME,ua.PASSWORD,ua.EMAIL,ua.MOBILE,ua.CREATEDATE,ua.LASTLOGINDATE,ua.MOBILE,ua.OrgTag, ua.Power,ua.RealName,ua.DepartmentName FROM dbo.UserRole AS ur INNER JOIN dbo.Role AS r ON ur.RoleID=r.ID INNER JOIN dbo.UserAccounts AS ua ON ua.USERID=ur.UserID

        string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
        UserRoleEntity urEntity = UserRoleFacade.GetUserRoleByUserID(Convert.ToInt32(userid));

        string result = "{\"success\":0}";
        string jsonData = "";
        int totalCount = 1;
        String Start = context.Request["start"];
        String PageSize = context.Request["page_size"];
        String pageWhere = "orgtag='anjian'";
        if (urEntity.RoleID != 1)
        {
            pageWhere += " and ua.USERID=" + userid + " ";
        }
        String pageOrderBy = context.Request["orderBy"];
        jsonData = UserAccountsFacade.GetPage2(pageWhere, null, pageOrderBy, Convert.ToInt32(PageSize), Convert.ToInt32(Start)).ToJson();
        totalCount = UserAccountsFacade.GetTotalCount(pageWhere, null);
        result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + ",\"userid\":" + userid + "}";
        return result;
    }
    private string CheckPower()
    {
        string power = Util.ConfigUtil.CacheUsreInfo.UserID();
        int p = string.IsNullOrEmpty(power) ? 0 : Convert.ToInt32(power);
        UserAccountsEntity uEntity = UserAccountsFacade.GetUserById(p);
        return "{\"Success\":1,\"Power\":" + uEntity.Power + "}";
        //Util.ConfigUtil.CacheUsreInfo.UserID();
    }


    private string GetOrg()
    {
        string where = " isDel =0";
        string result = OrgFacade.GetOrgLisToJosn(where);
        //手动模拟数据
        //string result = "[{\"ID\":1,\"OrgDesc\":\"安监\",\"OrgTag\":\"anjian\"}]";
        if (result != "")
        {
            return "{\"data\":" + result + ",\"SuccessCode\":1}";
        }
        else
        {
            return "{\"SuccessCode\":1}";
        }
    }

    private string CheckUser()
    {
        StringBuilder jsonStr = new StringBuilder();
        string userName = GetUserName();
        string path = GetDefaultPath();
        if (!string.IsNullOrEmpty(userName))
        {
            //string cookvalue = UserId + "|" + userName + "|" + dbkey + "|" + idolDbName + "|" + idolIp + "|" + serverName;
            jsonStr.Append("{\"SuccessCode\":1,\"path\":\"" + path + "\"}");
        }
        else
        {
            jsonStr.Append("{\"SuccessCode\":0}");
        }
        return jsonStr.ToString();
    }

    private string GetDefaultPath()
    {
        string[] userInfo = GetUser();
        if (userInfo != null && userInfo.Length > 0)
        {
            return userInfo[7];
        }
        else
        {
            return null;
        }
    }
    private string GetUserName()
    {
        string[] userInfo = GetUser();
        if (userInfo != null && userInfo.Length > 0)
        {
            // InitCacheUserInfo(userInfo[0], userInfo[1], userInfo[2], userInfo[3], userInfo[4], userInfo[5]);
            return userInfo[1];
        }
        else
        {
            return null;
        }
    }

    private string[] GetUser()
    {
        HttpCookie Cookie = HttpContext.Current.Request.Cookies[SessionKey];
        if (Cookie == null)
        {
            return null;
        }
        else
        {
            return DESEncrypt.Decrypt(Cookie.Value.ToString()).Split('|');
        }
    }

    private string UserLogin(HttpContext context)
    {
        string userName = context.Request["username"];
        string passWord = context.Request["password"];
        //string codeStr = context.Request.Form["Code_Str"];
        string serverName = context.Request["servername"];
        StringBuilder jsonStr = new StringBuilder();
        //string code = context.Session["CheckCode"].ToString();
        //if (codeStr.ToLower() == code.ToLower())        
        if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(passWord))
        {
            UserAccountsEntity user = BLL.Facade.UserAccountsFacade.GetUser(userName, passWord, serverName);

            //手动模拟一个用户信息
            //UserAccountsEntity user = new UserAccountsEntity();
            //user.CREATEDATE = DateTime.Now;
            //user.DepartmentName = "";
            //user.EMAIL = "520li-xiaolin@163.com";
            //user.LASTLOGINDATE = DateTime.Now;
            //user.LASTLOGINIP = "127.0.0.1";
            //user.MOBILE = "";
            //user.ORGTAG = "1";
            //user.PASSWORD = "53514098";
            //user.Power = 1;
            //user.RealName = "";
            //user.USERID = 1;
            //user.USERNAME = "管理员";
            //user.DefaultPath = "main.html";

            if (user != null)
            {
                //user.ORGTAG == "";
                String path = user.DefaultPath == "" ? "main.html" : user.DefaultPath;
                string UserName = user.USERNAME;
                string UserId = user.USERID.ToString();
                string Power = user.Power.ToString();
                //string RoleIDStr = UsersInRolesFacade.GetUserRoleIdList(user.USERID.Value);
                context.Session.Add("org", serverName);
                string orgXmlPath = ConfigUtil.GetAppSetting("orgXmlPath");
                orgXmlPath = context.Server.MapPath(orgXmlPath);

                string dbkey = ConfigUtil.GetDataSourceConfigInfo(orgXmlPath, serverName, "dbkey");
                string idolIp = ConfigUtil.GetDataSourceConfigInfo(orgXmlPath, serverName, "idolip");
                string idolDbName = ConfigUtil.GetDataSourceConfigInfo(orgXmlPath, serverName, "idoldb");
                string idolVideoDbName = ConfigUtil.GetDataSourceConfigInfo(orgXmlPath, serverName, "idolvideodb");
                string cookvalue = UserId + "|" + userName + "|" + dbkey + "|" + idolDbName + "|" + idolIp + "|" + serverName + "|" + idolVideoDbName + "|" + path;
                string cookiestr = DESEncrypt.Encrypt(cookvalue);
                if (context.Request.Cookies[SessionKey] != null)
                {
                    HttpCookie oldCookie = context.Request.Cookies[SessionKey];
                    oldCookie.Expires = DateTime.Now.AddDays(-1);
                    context.Response.SetCookie(oldCookie);
                }
                HttpCookie cookie = new HttpCookie(SessionKey);
                cookie.Value = cookiestr;
                cookie.Expires = DateTime.Now.AddDays(1);
                context.Response.SetCookie(cookie);

                HttpCookie cookieUserid = new HttpCookie("__USERID");
                cookieUserid.Value = user.USERID.ToString();
                cookie.Expires = DateTime.Now.AddYears(1);
                context.Response.SetCookie(cookieUserid);
                string tag = BLL.Facade.UserAccountsFacade.GetCityTag(user.USERID);
                HttpCookie alarmword = new HttpCookie("_ACCIDENTALARMTAG_");
                alarmword.Value = DESEncrypt.Encrypt(tag);
                alarmword.Expires = DateTime.Now.AddYears(1);
                context.Response.SetCookie(alarmword);
                jsonStr.Append("{\"SuccessCode\":\"1\",\"path\":\"" + path + "\"}");
            }
            else
            {
                jsonStr.Append("{\"SuccessCode\":0}");
            }
        }
        else
        {
            jsonStr.Append("{\"SuccessCode\":0}");
        }
        return jsonStr.ToString();
    }
    public string Quit(HttpContext context)
    {
        HttpCookie cookie = new HttpCookie(SessionKey);
        cookie.Expires = DateTime.Now.AddDays(-1);
        context.Response.SetCookie(cookie);
        return "{\"SuccessCode\":1}";
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}