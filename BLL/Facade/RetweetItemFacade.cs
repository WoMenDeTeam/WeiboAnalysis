using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class RetweetItemFacade
    {
        private static readonly RetweetItemEntity.RetweetItemDAO dao = new RetweetItemEntity.RetweetItemDAO();

        public static DataTable GetReItemList(string where, string orderby, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, null, orderby, pageSize, pageNumber);
        }

        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
    }
}
