using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;
using System.Data.SqlClient;

namespace BLL.Facade
{
    public static class UserAccountsFacade
    {
        private static readonly UserAccountsEntity.UserAccountsDAO dao = new UserAccountsEntity.UserAccountsDAO();
        public static UserAccountsEntity GetUser(string userName, string passWord, string serverName)
        {
            IList<UserAccountsEntity> list = dao.GetUser(userName, passWord, serverName);
            if (list.Count > 0)
            {
                return list[0];
            }
            else
            {
                return null;
            }
        }
        public static UserAccountsEntity GetUserById(int userId)
        {
            return dao.FindById(userId);
        }
        public static DataTable GetUserList()
        {
            return dao.GetDataSet(" OrgTag='anjian' ", null).Tables[0];
        }
        public static void AddUserAccount(int userid, string username, string password, string email, string mobile, string orgTag, int power, string realName, string departmentName)
        {
            UserAccountsEntity entity = new UserAccountsEntity()
            {
                USERID = 0,
                USERNAME = username,
                PASSWORD = password,
                EMAIL = email,
                CREATEDATE = DateTime.Now,
                ORGTAG = "anjian",
                Power = power,
                MOBILE = mobile,
                RealName = realName,
                DepartmentName = departmentName
            };
            dao.Add(entity);
        }
        public static void UpdateUserAccount(int userid, string username, string password, string email, string mobile, string orgTag, int power, string realName, string departmentName)
        {
            UserAccountsEntity entity = dao.FindById(userid);
            entity.USERNAME = username;
            entity.PASSWORD = password;
            entity.EMAIL = email;
            entity.MOBILE = mobile;
            entity.Power = power;
            entity.RealName = realName;
            entity.DepartmentName = departmentName;
            dao.Update(entity);
        }
        public static void DelUserAccount(int userid)
        {
            dao.Delete(userid);
        }
        public static void UpdatePassword(int userid, string pasword)
        {
            UserAccountsEntity entity = GetUserById(userid);
            entity.PASSWORD = pasword;
            dao.Update(entity);
        }
        public static int GetTotalCount(string where, SqlParameter[] param)
        {
            return dao.GetPagerRowsCount(where, param);
        }
        public static DataTable GetPage(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, param, orderBy, pageSize, pageNumber);
        }
        public static DataTable GetPage2(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager2(where, param, orderBy, pageSize, pageNumber);
        }
        public static DataTable GetUserInfo(string where)
        {
            return GetPage2(where, null, null, 10, 1);
        }
        //没有分某个配任务的人
        public static DataTable GetTackUser(string taskid)
        {
            string WHERE = string.Format(" USERID IN( SELECT  UserID FROM dbo.UserRole WHERE RoleID=2)  AND USERID NOT IN(SELECT ReceiverID FROM dbo.UserTask WHERE TaskID={0})", taskid);
            return dao.GetDataSet(WHERE, null).Tables[0];
        }
    }
}
