using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class RoleFacade
    {
        public static RoleEntity.RoleDAO dao = new RoleEntity.RoleDAO();
        public static DataTable GetRoleList()
        {
            DataTable tb = dao.GetDataSet("", null).Tables[0];
            return tb;
        }
        public static RoleEntity GetRoleById(int id)
        {
            return dao.FindById(id);
        }
        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        public static DataTable GetPage(string where, string orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, null, orderBy, pageSize, pageNumber);
        }
        public static void AddRole(string roleName)
        {
            RoleEntity entity = new RoleEntity() { RoleName = roleName };
            dao.Add(entity);
        }
        public static void UpdateRole(int id, string roleName)
        {
            RoleEntity entity = new RoleEntity();
            entity.ID = id;
            entity.RoleName = roleName;
            dao.Update(entity);
        }
        public static void DelRole(int id)
        {
            RoleEntity entity = new RoleEntity() { ID = id };
            dao.Delete(entity);
        }
    }
}
