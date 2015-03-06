using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
namespace BLL.Facade
{
    public class OrgFacade
    {
        private static OrgEntity.OrgDAO dao = new OrgEntity.OrgDAO();
        public static string GetOrgLisToJosn(string where )
        {
            string result = "";
            StringBuilder sbResult = new StringBuilder();
            List<OrgEntity> list = dao.Find(where, null);
            sbResult.Append("[");
            foreach (var item in list)
            {
                sbResult.Append("{");
                sbResult.AppendFormat("\"ID\":\"{0}\",", item.ID);
                sbResult.AppendFormat("\"OrgDesc\":\"{0}\",", item.OrgDesc);
                sbResult.AppendFormat("\"OrgTag\":\"{0}\"", item.OrgTag);
                sbResult.Append("},");
            }
            if (list != null)
            {
                sbResult.Remove(sbResult.Length - 1, 1);
                sbResult.Append("]");
                result = sbResult.ToString();
            }
            else
            {
                result = "";
            }

            return result;
        }
    }
}
