using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Xml.Linq;
using System.Web;

namespace Util
{
    public class ConfigUtil
    {
        public static string GetAppSetting(string key)
        {
            if (ConfigurationManager.AppSettings[key] != null)
            {
                return ConfigurationManager.AppSettings[key].ToString();
            }
            else
            {
                return null;
            }
        }

        public static string GetConnStr(string key)
        {
            if (ConfigurationManager.ConnectionStrings[key] != null)
            {
                return ConfigurationManager.ConnectionStrings[key].ConnectionString;
            }
            else
            {
                return null;
            }
        }
        /// <summary>
        /// 获取数据源配置（xml）信息
        /// </summary>
        /// <param name="xmlpath">数据源配置XML路径</param>
        /// <param name="sourceName">数据组织名称(xml中 source的name 例:anjian)</param>
        /// <param name="noteKey">数据节点名称(xml中source子节点名称 例:dbkey)</param>
        /// <returns></returns>
        public static string GetDataSourceConfigInfo(string xmlpath, string sourceName, string noteKey)
        {
            string configInfo = string.Empty;
            XElement x = XElement.Load(xmlpath);
            configInfo = x.Elements("source").Where(a => a.Attribute("name").Value == sourceName).
                            Elements(noteKey).Select(a => a.Attribute("name").Value).First().ToString();
            return configInfo;
        }

        public static class CacheUsreInfo
        {
            private static string KeyWord = ConfigurationManager.AppSettings["SessionKey"].ToString();
            private static string[] GetCookie()
            {
                string cookiesValue = HttpContext.Current.Request.Cookies[KeyWord] == null ? "" : HttpContext.Current.Request.Cookies[KeyWord].Value;
                return String.IsNullOrEmpty(cookiesValue) ? new string[6] : DESEncrypt.Decrypt(cookiesValue).Split('|');
            }
            public static string UserID()
            {
                return GetCookie()[0];
            }
            public static string UserName()
            {
                return GetCookie()[1];
            }
            public static string SqlDBKey()
            {
                return GetCookie()[2];
            }
            public static string IdolDbName()
            {
                return GetCookie()[3];
            }
            public static string IdolVideoDBName()
            {
                return GetCookie()[6];
            }
            public static string IdolIp()
            {
                return GetCookie()[4];
            }
            public static string OrgName()
            {
                return GetCookie()[5];
            }


        }
    }

}
