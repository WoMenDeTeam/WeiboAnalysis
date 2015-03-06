using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;
using System.Data.SqlClient;

namespace BLL.Facade
{
    public class OperatingLogFacade
    {

        private static OperatingLogEntity.OperatingLogDAO dao = new OperatingLogEntity.OperatingLogDAO();
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <param name="machineIp">用户Ip地址</param>
        /// <param name="operating">用户操作类型</param>
        /// <param name="operatingContent">详情</param>
        /// <param name="errorContent">异常</param>
        public static void Add(string userName, string machineIp, int operating, string operatingContent, string errorContent)
        {
            OperatingLogEntity entity = new OperatingLogEntity();
            entity.UserName = userName;
            entity.IP = machineIp;
            entity.Operation = operating;
            entity.VisitUrl = operatingContent;
            entity.OperateTime = DateTime.Now;
            entity.ErrorContent = errorContent;
            dao.Add(entity);
        }
        public static void Del(int id)
        {
            OperatingLogEntity entity = new OperatingLogEntity();
            entity.ID = id;
            dao.Delete(entity);
        }


        public static DataTable GetPage(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, param, orderBy, pageSize, pageNumber);
        }

        public static int GetTotCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
    }
}
