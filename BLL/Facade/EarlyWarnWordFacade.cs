using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class EarlyWarnWordFacade
    {
        private static EarlyWarnWordEntity.EarlyWarnWordDAO dao = new EarlyWarnWordEntity.EarlyWarnWordDAO();
        public static int GetTotalCount(String where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        public static DataTable GetList(String where, String orderBy, int pageSize, int pageNumber)
        {
            return dao.GetJoinPager(where, null, orderBy, pageSize, pageNumber);
        }
        public static DataSet GetWarningIDS(String where,String orderBy)
        {
            return dao.GetIDList(where, orderBy, null);
        }
        public static int UpdateWarnState(String where)
        {
            return dao.UpdateIsRead(where, null);
        }
    }
}
