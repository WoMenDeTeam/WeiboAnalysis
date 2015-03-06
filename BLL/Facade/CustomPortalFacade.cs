using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;
using Util;
namespace BLL.Facade
{
    public static class CustomPortalFacade
    {
        private static CustomPortalEntity.CustomPortalDAO dao = new CustomPortalEntity.CustomPortalDAO();
        public static int GetTotalCount(String where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        public static void Insert(String userid,String customStr)
        {
             dao.Add(new CustomPortalEntity() { UserID = Convert.ToInt32(userid), CustomString = customStr });
        }
        public static void Update(String userid, String customStr)
        {
            dao.Update(new CustomPortalEntity() { UserID = Convert.ToInt32(userid), CustomString = customStr });
        }
        public static String GetCustomStr(string userid)
        {
            return dao.FindById(Convert.ToInt32(userid)).CustomString;
        }
    }
}
