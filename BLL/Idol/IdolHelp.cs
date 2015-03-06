using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IdolACINet;
using System.Xml;
using System.Configuration;

namespace BLL.Idol
{
    public class IdolHelp
    {

        private static string hostname = Util.ConfigUtil.CacheUsreInfo.IdolIp(); //ConfigurationManager.AppSettings["IdolHttp"];
        private static Connection conn = new Connection(hostname, 9000);
        public static long GetLastStamp(string jobName)
        {
            
            //excute command to show jobs
            Command cmd = new Command("ClusterShowJobs");            
            Response r = conn.Execute(cmd);
            XmlDocument xdJobs = r.Data;

            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xdJobs.NameTable);
            nsmgr.AddNamespace("autn", @"http://schemas.autonomy.com/aci/");

            string format = "//autn:cluster/autn:name[text()='{0}']/..//autn:timestamp[last()]";
            string xPathStamp = string.Format(format, jobName);
            string strStamp = xdJobs.SelectSingleNode(xPathStamp, nsmgr).InnerText;
            return long.Parse(strStamp);
        }


        public static bool AddUser(string username,string pwd) {
            Command cmd = new Command("UserAdd");
            cmd.SetParam("UserName", username);
            cmd.SetParam("Password", pwd);
            Response r = conn.Execute(cmd);
            XmlDocument xmldoc = r.Data;
            if (xmldoc != null) {
                return true;
            }
            return false;
        }

        public static bool DeleteUser(string username)
        {
            Command cmd = new Command("UserDelete");
            cmd.SetParam("UserName", username);            
            Response r = conn.Execute(cmd);
            XmlDocument xmldoc = r.Data;
            if (xmldoc != null)
            {
                return true;
            }
            return false;
        }
    }
}
