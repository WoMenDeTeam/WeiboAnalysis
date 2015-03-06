using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data.SqlClient;
using System.Data;

namespace BLL.Facade
{
    public static class UserCollectFacade
    {
        public static UserCollectEntity.UserCollectDAO dao = new UserCollectEntity.UserCollectDAO();
        public static void AddCollect(string idolId, string title)
        {

            int userId = Convert.ToInt32(Util.ConfigUtil.CacheUsreInfo.UserID());
            if (GetList(userId, idolId).Count > 0)
            {
                return;
            }
            UserCollectEntity entity = new UserCollectEntity();
            entity.IdolID = idolId;
            entity.Title = title;
            entity.UserID = userId;
            entity.CollectTime = DateTime.Now;
            dao.Add(entity);

        }
        public static DataTable GetLisByUserID(int userId)
        {
            userId = userId == 0 ? Convert.ToInt32(Util.ConfigUtil.CacheUsreInfo.UserID()) : userId;

            string where = " UserId=" + userId;
            DataTable dt = dao.GetDataSet(where, null).Tables[0];
            return dt;
        }

        public static void DelCollect(int userId, string idolId)
        {
            userId = userId == 0 ? Convert.ToInt32(Util.ConfigUtil.CacheUsreInfo.UserID()) : userId;
            List<UserCollectEntity> list = GetList(userId, idolId);
            foreach (UserCollectEntity item in list)
            {
                dao.Delete(item);
            }
        }
        public static List<UserCollectEntity> GetList(int userId, string idolId)
        {
            UserCollectEntity entity = new UserCollectEntity();
            string where = string.Format(" UserID={0} AND IdolID={1}", userId, idolId);
            List<UserCollectEntity> listeEntity = dao.Find(where, null);
            return listeEntity;
        }

    }
}
