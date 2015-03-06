using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class KeyWordsFacade
    {
        private static readonly KeyWordsEntity.KeyWordsDAO dao = new KeyWordsEntity.KeyWordsDAO();
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
            dao.Delete(new KeyWordsEntity() { ID = ID });
        }
        public static void Insert(String Name, String Tag, Int32 type)
        {
            KeyWordsEntity key = new KeyWordsEntity()
            {
                Name = Name,
                KeywordType = type,
                Tag = Tag
            };
            dao.Add(key);
        }
        public static void Update(Int32 ID, String Name,int Type, String Tag)
        {
            KeyWordsEntity key = new KeyWordsEntity()
            {
                ID = ID,
                Name = Name,
                 KeywordType=Type,
                Tag = Tag
            };
            dao.Update(key);
        }
    }
}
