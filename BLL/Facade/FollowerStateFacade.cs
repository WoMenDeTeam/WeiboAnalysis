using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
namespace BLL.Facade
{
    public static class FollowerStateFacade
    {
        private static FollowerStateEntity.FollowerStateDAO dao = new FollowerStateEntity.FollowerStateDAO();
        public static void AddFollowerState(string userName, int webSource)
        {
            FollowerStateEntity entity = dao.FindByWhere(userName, webSource);
            if (entity == null)
            {
                entity = new FollowerStateEntity { UserName = userName, WebSource = webSource, UserState = 1 };
                dao.Add(entity);
            }
            else
            {
                entity.UserState = 1;
                dao.Update(entity);
            }
        }
        public static void UpdateFollowerState(string userName, int webSource)
        {
            FollowerStateEntity entity = dao.FindByWhere(userName, webSource);
            //FollowerStateEntity entity = new FollowerStateEntity { ID = id, UserName = userName, WebSource = webSource, UserState = userState };
            if (entity != null)
            {
                entity.UserState = 2;
                dao.Update(entity);
            }
        }
    }
}
