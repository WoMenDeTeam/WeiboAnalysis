using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class RreportFacade
    {
        private static reportEntity.reportDAO dao = new reportEntity.reportDAO();
        public static List<reportEntity> GetList()
        {
            return dao.Find("", null);
        }
        public static int AddReport(string authorName, string dreContent, string forwardNum, string forwardUrl, string profileImageUrl, string referenceId, string replyNum, string replyUrl, string siteName, string thumbnailPic, string timesTamp, string weiboUrl)
        {
            int result = 1;
            string sqlw = string.Format(" referenceId='{0}'", referenceId);
            int w = FindByWhere(sqlw);
            if (w > 0)
            {
                result = 2;
            }
            else
            {
                reportEntity entity = new reportEntity();
                entity.authorName = authorName;
                entity.dreContent = dreContent;
                entity.forwardNum = forwardNum;
                entity.forwardUrl = forwardUrl;
                entity.initTime = DateTime.Now;
                entity.profileImageUrl = profileImageUrl;
                entity.referenceId = referenceId;
                entity.replyNum = replyNum;
                entity.replyUrl = replyUrl;
                entity.siteName = siteName;
                entity.thumbnailPic = thumbnailPic;
                entity.timesTamp = timesTamp;
                entity.weiboUrl = weiboUrl;
                dao.Add(entity);
            }
            return result;
        }
        public static void DelReport(int id)
        {
            reportEntity entity = new reportEntity();
            entity.ID = id;
            dao.Delete(entity);
        }
        public static int FindByWhere(string where)
        {
            return dao.GetDataSet(where, null).Tables[0].Rows.Count;
        }
        public static DataTable GetListTab(string orderby)
        {
            return dao.GetDataSet("", orderby, null).Tables[0];
        }
    }
}
