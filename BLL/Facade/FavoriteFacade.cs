using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class FavoriteFacade
    {
        private static readonly FavoriteEntity.FavoriteDAO dao = new FavoriteEntity.FavoriteDAO();
        public static int GetFavoriteCountByID(int MainID)
        {
            string where = string.Format("MainID={0} AND UserId={1}", MainID, Util.ConfigUtil.CacheUsreInfo.UserID());
            return dao.GetPagerRowsCount(where, null);
        }
        public static int GetTotalCount(String where)
        {
            string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
            if (string.IsNullOrEmpty(where))
            {

                where = "UserId=" + userid;
            }
            else
            {
                where = " AND UserId=" + userid;

            }
            return dao.GetPagerRowsCount(where, null);
        }
        public static void Insert(int mainID, DateTime insertTime)
        {
            string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
            dao.Add(new FavoriteEntity() { MainID = mainID, InsertTime = insertTime, UserId = Convert.ToInt32(userid) });
        }
        public static void Del(int mainID)
        {
            string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
            dao.Delete(new FavoriteEntity() { MainID = mainID, UserId = Convert.ToInt32(userid) });
        }
        public static DataTable GetList(String where, String orderBy, int pageSize, int pageNumber)
        {
            string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
            if (string.IsNullOrEmpty(where))
            {
                where = "UserId=" + userid;
            }
            else
            {
                where = " AND UserId=" + userid;
            }
            return dao.GetPager(where, null, orderBy, pageSize, pageNumber);
        }
        public static int DeleteByWhere(string delWhere)
        {
            return dao.DeleteByWhere(delWhere);

        }

    }
};