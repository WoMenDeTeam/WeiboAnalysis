using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public class AlarmKeywordsFacade
    {
        private static readonly AlarmKeywordsEntity.AlarmKeywordsDAO dao = new AlarmKeywordsEntity.AlarmKeywordsDAO();
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
            dao.Delete(new AlarmKeywordsEntity() { ID = ID });
        }
        public static void Insert(String Name, String Tag, Int32 type)
        {
            dao.Add(new AlarmKeywordsEntity() { Keyword = Name, KeywordType = type, Tag = Tag });
        }
        public static void Update(Int32 ID, String Name, int Type, String Tag)
        {
            dao.Update(new AlarmKeywordsEntity() { ID = ID, Keyword = Name, KeywordType = Type, Tag = Tag });
        }
    }
}
