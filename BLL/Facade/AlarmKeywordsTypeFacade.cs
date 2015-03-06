using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public class AlarmKeywordsTypeFacade
    {

        private static readonly AlarmKeywordsTypeEntity.AlarmKeywordsTypeDAO dao = new AlarmKeywordsTypeEntity.AlarmKeywordsTypeDAO();
        public static int GetTotalCount(String where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        public static DataTable GetList(String where, String orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, null, orderBy, pageSize, pageNumber);
        }

        public static void Del(Int32 ID)
        {
            dao.Delete(new AlarmKeywordsTypeEntity() { ID = ID });
        }
        public static void Insert(String Name)
        {
            dao.Add(new AlarmKeywordsTypeEntity() { TypeName = Name });
        }
        public static void Update(Int32 ID, String Name)
        {
            dao.Update(new AlarmKeywordsTypeEntity() { ID = ID, TypeName = Name });
        }

    }
}
