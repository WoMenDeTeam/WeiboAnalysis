using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data.SqlClient;
using System.Data;

namespace BLL.Facade
{
    public static class TopicItemFacade
    {
        private static readonly TopicItemEntity.TopicItemDAO dao = new TopicItemEntity.TopicItemDAO();
        public static int Add(string vals)
        {
            return dao.Add(vals);
        }
        public static DataTable GetByTopicIdToTable(int topicid)
        {

            return dao.GetDataSet(" TopicID= " + topicid + " ", null).Tables[0];
        }
        public static string getByTopicIdToJson(int topicid)
        {
            List<TopicItemEntity> list = dao.FindByTopicId(topicid);

            return ListToJson(list);//strBuilder.ToString();
        }
        public static string ListToJson(List<TopicItemEntity> list)
        {
            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append("\"data\":[");
            foreach (var item in list)
            {
                strBuilder.Append("{");
                strBuilder.AppendFormat("\"id\":{0},\"itemId\":{1},\"mainId\":{2},\"topicId\":{3},\"webSource\":{4}", item.ID, item.ItemID, item.MainID, item.TopicID, item.WebSource);
                strBuilder.Append("},");
            }
            if (list.Count > 0)
            {
                strBuilder.Remove(strBuilder.Length - 1, 1);
            }
            strBuilder.Append("]");
            return strBuilder.ToString();
        }
        public static void deleteByWhere(int topicId, string where)
        {
            dao.DeleteByWhere(topicId, where);
        }
    }
}
