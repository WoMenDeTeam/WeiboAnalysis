using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data.SqlClient;

namespace BLL.Facade
{
    public static class UserRoleFacade
    {
        public static UserRoleEntity.UserRoleDAO dao = new UserRoleEntity.UserRoleDAO();
        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }

        public static void AddUserRole(int userId, int roleId)
        {
            UserRoleEntity entity = new UserRoleEntity() { RoleID = roleId, UserID = userId };
            dao.Add(entity);
        }
        public static void UpdateUserRole(int userid, int roleid)
        {
            UserRoleEntity entity = GetUserRoleByUserID(userid);
            if (entity != null)
            {
                entity.RoleID = roleid;
                dao.Update(entity);
            }
        }
        public static UserRoleEntity GetUserRoleByUserID(int userid)
        {
            UserRoleEntity entity = new UserRoleEntity();
            string sqlw = "UserID=@UserID";
            SqlParameter[] param = { new SqlParameter("@UserID", userid) };
            List<UserRoleEntity> list = dao.Find(sqlw, param);
            if (list.Count > 0)
            {
                entity = list[0];
                entity.UserRole = RoleFacade.GetRoleById(entity.RoleID);
            }
            else
            {
                entity = null;
            }
            return entity;
        }
        public static void GetListByRoleId(int roleId)
        {

        }
        public static void DelByUserId(int userid)
        {
            UserRoleEntity entity = GetUserRoleByUserID(userid);
            dao.Delete(entity);
        }
    }
}
