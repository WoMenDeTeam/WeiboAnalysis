using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class FollowerEntityFacade
    {
        private static readonly FollowerEntity.FollowerDAO dao = new FollowerEntity.FollowerDAO();

        public static int GetTotalCount(string where)
        {

            return dao.GetPagerRowsCount(where, null);
        }
        public static DataTable GetJsonList(String where, String orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, null, orderBy, pageSize, pageNumber);
        }
        public static string Add(string userName, string nick, string webSource)
        {
            string result = "1";
            FollowerEntity entity = new FollowerEntity();
            entity.InsertTime = DateTime.Now;
            entity.UserName = userName;
            entity.Nick = nick;
            entity.WebSource = string.IsNullOrEmpty(webSource) ? 0 : int.Parse(webSource);
            result = Add(entity);
            return result;
        }
        public static string Add(FollowerEntity entity)
        {
            entity.InsertTime = DateTime.Now;
            string result = "1";

            try
            {
                dao.Add(entity);
            }
            catch
            {
                result = "0";
            }
            return result;

        }
        public static FollowerEntity FindByUserName(string userName, string webSource)
        {
            FollowerEntity entity = dao.FindByUserName(userName, webSource);
            return entity;
        }
        public static string GetAttentionToJson()
        {
            List<FollowerEntity> list = dao.Find("", null);
            StringBuilder builderJson = new StringBuilder();
            builderJson.Append("{");
            foreach (var item in list)
            {
                builderJson.AppendFormat("\"{0}_{1}\":\"{2}\",", item.UserName, item.WebSource, item.Nick);
            }
            if (list.Count > 0)
            {
                builderJson.Remove(builderJson.Length - 1, 1);
            }
            builderJson.Append("}");
            return builderJson.ToString();
        }
        public static string Delete(string userName, int webSource)
        {
            string result = "1";
            try
            {
                dao.Delete(new FollowerEntity() { UserName = userName, WebSource = webSource });
            }
            catch
            {
                result = "0";

            }
            return result;
        }
        public static void DeleteById(int id)
        {
            dao.Delete(id);
        }
        public static FollowerEntity GetFollowerById(int id)
        {
            return dao.FindById(id);
        }
        public static void UpdateFollowerGroup(int id, int gid)
        {
            FollowerEntity entity = GetFollowerById(id);
            entity.GroupID = gid;
            dao.Update(entity);
        }
        public static string GetlistUserByGroupid(int gid)
        {
            return dao.GetDataSet("GroupID=" + gid, null).Tables[0].ToJson();
        }

        public static void DeleteGroup(int id)
        {
            dao.ResetGroupId(id);
        }

        public static void SetUserGroup(int gid, string ids)
        {
            dao.SetUserGroup(gid, ids);
        }
    }
}
