using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Util;
using DBDAL.Entity;
using System.Data;
namespace BLL.Facade
{
    public static class ReItemFacade
    {
        private static readonly ReItemEntity.ReItemDAO dao = new ReItemEntity.ReItemDAO();
        public static DataTable GetComments(String mainId, String orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(String.Format("MainID='{0}'", mainId), null, orderBy, pageSize, pageNumber);
        }
        public static DataTable GetReItemList(string where, string orderby, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, null, orderby, pageSize, pageNumber);
        }
        public static string PlCount(string ids)
        {
            return dao.GetPlCount(ids).Tables[0].ToJson();
        }

        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
    }
}
