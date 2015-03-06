using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;

namespace BLL.Facade
{
    public static class FavoriteStateFacade
    {
        private static FavoriteStateEntity.FavoriteStateDAO dao = new FavoriteStateEntity.FavoriteStateDAO();

        public static void AddFavoriteState(int mindId)
        {
            FavoriteStateEntity entity = dao.FindByMainID(mindId);
            if (entity == null)
            {
                dao.Add(entity = new FavoriteStateEntity { ID = 0, MainID = mindId, State = 1 });
            }
            else
            {
                entity.State = 1;
                dao.Update(entity);
            }
        }
        public static void UpdateFavoriteState(int mainId)
        {
            FavoriteStateEntity entity = dao.FindByMainID(mainId);
            if (entity != null)
            {
                entity.State = 2;
                dao.Update(entity);
            }
        }
        public static void UpdateFavoriteStateList(string ids)
        {
            dao.UpdateByWhere(ids, 2);
        }
    }
}
