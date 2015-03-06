using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class SysGroupFacade
    {
        private static sysGroupEntity.sysGroupDAO dao = new sysGroupEntity.sysGroupDAO();
        //新增分组
        public static void AddGroup(string groupName)
        {
            sysGroupEntity entity = new sysGroupEntity();
            entity.GroupName = groupName;
            entity.GroupIndex = 0;
            dao.Add(entity);
        }
        //删除分组
        public static void DeleteGroup(int id)
        {
            sysGroupEntity entity = new sysGroupEntity();
            entity.ID = id;
            dao.Delete(entity);
        }
        //修改分组
        public static void UpdateGroup(int id, string name, int groupIndex)
        {
            sysGroupEntity entity = new sysGroupEntity();
            entity.ID = id;
            entity.GroupName = name;
            entity.GroupIndex = groupIndex;
            dao.Update(entity);
        }
        //获取列表
        public static DataTable GetGroupList()
        {
            return dao.GetDataSet("", null).Tables[0];
        }
    }
}
