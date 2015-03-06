using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;
using BLL.Facade;
using BLL.Idol;

namespace BLL.Facade
{
    public class TopicManage
    {
        private TopicFacade tf = null;
        public TopicManage()
        {
            tf = new TopicFacade();
        }
        public int GetTotalCount(string where)
        {
            return tf.getTotalCount("Topic", "where " + where);
        }
        public string GetTopicPager(string keywords, string jobstate, string topicindustry, string stime, string etime, int start, int pagesize, string orderby)
        {
            string json = string.Empty;
            string sqlwhere = "where isdel=0 ";
            if (!string.IsNullOrEmpty(jobstate))
            {
                sqlwhere += "and " + jobstate;
            }
            if (!string.IsNullOrEmpty(keywords))
            {
                sqlwhere += "and name like '%" + keywords + "%'";
            }
            if (!string.IsNullOrEmpty(topicindustry)) { sqlwhere += " and industry='" + topicindustry + "'"; }

            if (!string.IsNullOrEmpty(stime))
            {
                string[] tampTimestr = stime.Split('/');
                stime = tampTimestr[2] + "-" + tampTimestr[1] + "-" + tampTimestr[0];

                if (!string.IsNullOrEmpty(etime))
                {
                    tampTimestr = etime.Split('/');
                    etime = tampTimestr[2] + "-" + tampTimestr[1] + "-" + tampTimestr[0];
                    sqlwhere += " and starttime between  '" + stime + "' and '" + etime + "'";
                }
                else
                {
                    sqlwhere += " and starttime >'" + stime + "'";
                }

            }
            int totalcount = tf.getTotalCount("Topic", sqlwhere);
            string odb = string.Empty;
            if (string.IsNullOrEmpty(orderby))
            {
                odb = "order by starttime desc";
            }
            else
            {
                odb = "order by " + orderby;
            }
            json = tf.weibotopicjson(tf.getPager("Topic", sqlwhere, odb, start, pagesize), totalcount);
            return json;
        }

        public string GetUserPager(string groupId, string mainuid, string websource, string attentionType, int start, int pagesize)
        {
            string pageJson = string.Empty;
            //where MainUID='2659126494' and WebSource = '1' and AttentionType='1' and IsDel='0' and GroupID='{0}'
            string swhere = string.Format("where MainUID='{0}' and WebSource = '{1}' and AttentionType='{2}' and IsDel='0' and GroupID='{3}'", mainuid, websource, attentionType, string.IsNullOrEmpty(groupId) ? "0" : groupId);
            int friendscount = tf.getTotalCount("Attention", swhere);
            pageJson = tf.GetCategoryList(tf.getPager("Attention", swhere, "", start, pagesize), friendscount);
            return pageJson;
        }

        public bool TopicUpdate(string tname, string keyword, string industry, string sid, string stype)
        {
            bool isUpdated = false;
            string addsql = string.Empty;
            int identityid = -2;
            try
            {


                if (!string.IsNullOrEmpty(sid) && !string.IsNullOrEmpty(stype))
                {
                    int topicid = Convert.ToInt32(sid);
                    if (stype == "edit")
                    {
                        addsql = string.Format("update topic set {0} where id='{1}' select @@IDENTITY", tname, sid);
                    }
                    tf.sh.ExecuteSql(addsql, null);
                    //TopicStatistics_UpdateCount(keyword, topicid);
                    //TopicTotal_UpdateCount(keyword, topicid);
                    isUpdated = true;
                }
                
            }
            catch (Exception ex)
            {

                throw ex;
            }
            if (identityid > 0)
            {


                isUpdated = true;
            }


            return isUpdated;
        }




        private int GetIdolCount(QueryParamEntity qpe)
        {
            IdolQuery query = IdolQueryFactory.GetDisStyle(qpe.action);
            query.queryParamsEntity = qpe;
            return Convert.ToInt32(query.GetTotalCount());
        }
        //private void TopicStatistics_UpdateCount(string keyword, int tid)
        //{
        //    QueryParamEntity qpe = new QueryParamEntity();
        //    qpe.action = "query";
        //    qpe.DocumentCount = true;
        //    qpe.Predict = "false";
        //    qpe.DataBase = "WEIBO";
        //    qpe.TotalResults = true;
        //    qpe.Start = 1;
        //    qpe.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["pagesize"]);
        //    int originalidcount = 0;
        //    string topicids = "";
        //    int scount = 3;
        //    topicids = "";
        //    qpe.Text = keyword.Replace(",", "+AND+");
        //    int topicid = tid;
        //    if (TopicIDIsExists(topicid) <= 0)
        //    {
        //        while (scount > 1)
        //        {
        //            qpe.MinDate = DateTime.Now.AddDays(-scount).ToString("dd/MM/yyyy", System.Globalization.DateTimeFormatInfo.InvariantInfo);
        //            qpe.MaxDate = DateTime.Now.AddDays(-(scount - 1)).ToString("dd/MM/yyyy", System.Globalization.DateTimeFormatInfo.InvariantInfo);
        //            Console.WriteLine(qpe.MinDate + " " + qpe.MaxDate);
        //            originalidcount = GetIdolCount(qpe);

        //            topicids = GetTopicIDs(qpe, originalidcount);
        //            SqlParameter sp = new SqlParameter("@IDS", topicids);
        //            sp.Size = topicids.Length;
        //            SqlParameter[] sparams = new SqlParameter[] { 
        //                    new SqlParameter("@topicid",topicid),
        //                    new SqlParameter("@topicItemCount",originalidcount),
        //                    sp,
        //                    new SqlParameter("@InsertTime",DateTime.Now.AddDays(-scount).ToString("yyyy-MM-dd")),
        //                    new SqlParameter("@sTime",DateTime.Now.AddDays(-scount).ToString("yyyy-MM-dd")),
        //                    new SqlParameter("@eTime",DateTime.Now.AddDays(-(scount - 1)).ToString("yyyy-MM-dd"))
        //                };
        //            tf.sh.ExecuteProc("[dbo].[TopicStatistics_Insert]", sparams);
        //            sparams = null;
        //            scount--;
        //        }
        //    }

        //    qpe.MinDate = DateTime.Now.AddDays(-1).ToString("dd/MM/yyyy", System.Globalization.DateTimeFormatInfo.InvariantInfo);
        //    qpe.MaxDate = DateTime.Now.ToString("dd/MM/yyyy", System.Globalization.DateTimeFormatInfo.InvariantInfo);
        //    Console.WriteLine(qpe.MinDate + " " + qpe.MaxDate);
        //    originalidcount = GetIdolCount(qpe);
        //    if (originalidcount <= 0) { return; }
        //    topicids = GetTopicIDs(qpe, originalidcount);
        //    SqlParameter sp1 = new SqlParameter("@IDS", topicids);
        //    sp1.Size = topicids.Length;
        //    SqlParameter[] sparams1 = new SqlParameter[] { 
        //                    new SqlParameter("@topicid",topicid),
        //                    new SqlParameter("@topicItemCount",originalidcount),
        //                   sp1,
        //                    new SqlParameter("@InsertTime",DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        //                    new SqlParameter("@sTime",DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")),
        //                    new SqlParameter("@eTime",DateTime.Now.ToString("yyyy-MM-dd"))
        //                };


        //    tf.sh.ExecuteProc("[dbo].[TopicStatistics_Insert]", sparams1);

        //}

        //private void TopicTotal_UpdateCount(string keyword, int tid)
        //{
        //    QueryParamEntity qpe = new QueryParamEntity();
        //    qpe.action = "query";
        //    qpe.DocumentCount = true;
        //    qpe.Predict = "false";
        //    qpe.DataBase = "WEIBO";
        //    qpe.TotalResults = true;
        //    qpe.Start = 1;
        //    qpe.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["pagesize"]);
        //    int totalCount = 0;
        //    string ids = string.Empty;

        //    ids = string.Empty;
        //    qpe.Text = keyword.Replace(",", "+AND+");
        //    int topicid = Convert.ToInt32(tid);
        //    totalCount = GetIdolCount(qpe);
        //    ids = GetTopicIDs(qpe, totalCount);
        //    SqlParameter sp = new SqlParameter("@IDS", ids);
        //    SqlParameter[] sparams = new SqlParameter[] { 
        //                    new SqlParameter("@topicid",topicid),
        //                    new SqlParameter("@topicItemCount",totalCount),
        //                    sp
        //                };
        //    tf.sh.ExecuteProc("[dbo].[Topic_Update]", sparams);

        //}

        public int TopicIDIsExists(int topicid)
        {
            int tidCount = 0;
            string sql = string.Format("select count(topicid) from topicStatistics where topicid='{0}'", topicid);
            tidCount = Convert.ToInt32(tf.sh.GetSingle(sql, null));
            return tidCount;
        }
        public string GetHotTopic(string topicType)
        {
            string json = string.Empty;
            int tt = Convert.ToInt32(topicType);
            string inittopicsql = string.Empty;
            if (tt == 1)
            {
                inittopicsql = "select * from Topic where IsStop=0 order by CommentCount desc";
            }
            else
            {
                inittopicsql = "select * from Topic where IsStop=0 order by ForwardCount desc";
            }

            DataSet ds = tf.sh.ExecuteDateSet(inittopicsql, null);
            if (ds != null && ds.Tables.Count > 0)
            {
                json = tf.weibotopicjson(ds.Tables[0]);
            }
            return json;
        }
        public string DelTopic(string topicID)
        {
            string json = string.Empty;
            string updateStateSql = string.Format("update topic set IsDel='{0}' where id='{1}'", 1, topicID);
            if (tf.sh.ExecuteSql(updateStateSql, null) != 0)
            {
                json = "{\"Success\":1}";
            }
            else
            {
                json = "{\"Success\":0}";
            }
            return json;
        }
        public string InitCategory()
        {
            string retJson = string.Empty;
            string initCategorySql = "select * from CustomCategory where ParentCate=1";
            DataSet cates = tf.sh.ExecuteDateSet(initCategorySql, null);
            if (cates != null && cates.Tables.Count > 0)
            {
                retJson = tf.GetCategoryList(cates.Tables[0]);

            }
            return retJson;
        }
        public bool CategoryUpdate(string stype, string cateName, string catekeyword, string sid, string minscore)
        {
            bool isUpdated = false;
            string ModifyCategorySQL = string.Empty;
            if (!string.IsNullOrEmpty(stype) && !string.IsNullOrEmpty(sid))
            {
                ModifyCategorySQL = string.Format("update customCategory set CategoryName='{0}',Keywords='{1}',MinScore='{2}' where ID='{3}'", cateName.Replace("'", ""), catekeyword.Replace("'", ""), minscore.Replace("'", ""), sid);
            }
            else
            {
                ModifyCategorySQL = string.Format("insert into customCategory values('{0}','{1}','{2}','{3}','{4}','{5}')", cateName.Replace("'", ""), "1", "0", catekeyword.Replace("'", ""), minscore.Replace("'", ""), "1");
            }
            if (tf.sh.ExecuteSql(ModifyCategorySQL) > 0)
            {
                isUpdated = true;
            }

            return isUpdated;
        }
        public bool DelCategory(string cateid)
        {
            bool isUpdated = false;
            if (!string.IsNullOrEmpty(cateid))
            {
                string delcategorySQL = string.Format("delete customCategory where id='{0}'", Convert.ToInt32(cateid));
                if (tf.sh.ExecuteSql(delcategorySQL) > 0)
                {
                    isUpdated = true;
                }
            }
            return isUpdated;
        }

        public string InitKeywordsList()
        {
            string retJson = string.Empty;
            string initkeywordsSql = "select * from KeyWords";
            DataSet keywordList = tf.sh.ExecuteDateSet(initkeywordsSql, null);
            if (keywordList != null && keywordList.Tables.Count > 0)
            {
                retJson = tf.GetCategoryList(keywordList.Tables[0]);
            }
            return retJson;
        }

        public bool DelKeywords(string kwid)
        {
            bool isUpdated = false;
            if (!string.IsNullOrEmpty(kwid))
            {
                string delKeywordsSql = string.Format("delete [KeyWords] where ID='{0}'", Convert.ToInt32(kwid));
                if (tf.sh.ExecuteSql(delKeywordsSql, null) > 0)
                {
                    isUpdated = true;
                }
            }
            return isUpdated;
        }

        public bool KeywordsUpdate(string kwstype, string kwcateName, string kwRelevance, string kwsid)
        {
            bool isUpdated = false;
            string ModifyCategorySQL = string.Empty;
            if (!string.IsNullOrEmpty(kwstype) && !string.IsNullOrEmpty(kwsid))
            {
                ModifyCategorySQL = string.Format("update [KeyWords] set [Name]='{0}',[KWRelevance]='{1}' where ID='{2}'", kwcateName.Replace("'", ""), kwRelevance.Replace("'", ""), kwsid);
            }
            else
            {
                ModifyCategorySQL = string.Format("insert into [KeyWords] values('{0}','{1}')", kwcateName.Replace("'", ""), kwRelevance.Replace("'", ""));
            }
            if (tf.sh.ExecuteSql(ModifyCategorySQL) > 0)
            {
                isUpdated = true;
            }
            return isUpdated;
        }
        public string GetUserGroupList(string attentiontype, string mainUid)
        {
            string retJson = string.Empty;
            if (!string.IsNullOrEmpty(attentiontype))
            {
                string friendsGroupListSql = string.Format("select A.id,COUNT(b.ID)  'count',a.groupname from dbo.AttentionGroup a left join dbo.Attention b on a.ID=b.GroupID where a.AttentionType='{0}' and a.MainUID = '2659126494' group by a.id,a.groupname union select 0,count(1) 'count','未分组' from dbo.Attention where AttentionType='{1}'  and groupid=0 and MainUID='2659126494' and isdel=0", attentiontype.Replace("'", ""), attentiontype.Replace("'", ""));
                DataSet groupList = tf.sh.ExecuteDateSet(friendsGroupListSql, null);
                if (groupList != null && groupList.Tables.Count > 0)
                {
                    retJson = tf.GetCategoryList(groupList.Tables[0]);
                }
            }
            return retJson;
        }
        public bool GroupToAttention(string groupid, string grids)
        {
            bool isUpdated = false;
            string groupaSQL = string.Format("update Attention set GroupID='{0}' where ID in ({1}) ", Convert.ToInt32(groupid), grids.Replace("'", ""));
            if (tf.sh.ExecuteSql(groupaSQL, null) > 0)
            {
                isUpdated = true;
            }
            return isUpdated;
        }
        public bool GroupAttentionUpdate(string updategroupid, string updategrouptxt)
        {
            bool isUpdated = false;
            if (!string.IsNullOrEmpty(updategroupid) && !string.IsNullOrEmpty(updategrouptxt))
            {
                string updategroupSQL = string.Format("update AttentionGroup set GroupName='{0}' where ID='{1}'", updategrouptxt.Replace("'", ""), updategroupid);
                if (tf.sh.ExecuteSql(updategroupSQL, null) > 0)
                {
                    isUpdated = true;
                }
            }
            return isUpdated;
        }
        public int AddGroupAttention(string addgroupname, string addgroupAttentionType, string addgroupmainid)
        {
            // bool isUpdated = false;
            int result = 0;
            if (!string.IsNullOrEmpty(addgroupname) && !string.IsNullOrEmpty(addgroupAttentionType))
            {

                string insertgroupSQL = string.Format("insert into AttentionGroup values('{0}','{1}','{2}')  select @@IDENTITY", addgroupmainid, addgroupAttentionType, addgroupname.Replace("'", ""));
                result = Convert.ToInt32(tf.sh.ExecuteScalar(CommandType.Text, insertgroupSQL, null));
            }
            return result;
            //return isUpdated;
        }
        public bool DelAttentionGroup(string atgId)
        {
            bool isUpdated = false;
            if (!string.IsNullOrEmpty(atgId))
            {
                string delAttentionGroupSql = string.Format("delete AttentionGroup where id = {0}", Convert.ToInt32(atgId));
                string updateAttentionGroupIdSql = string.Format("update Attention set GroupID = 0 where GroupID = {0}", Convert.ToInt32(atgId));

                if (tf.sh.ExecuteSql(delAttentionGroupSql, null) > 0)
                {
                    tf.sh.ExecuteSql(updateAttentionGroupIdSql, null);
                    isUpdated = true;
                }
            }
            return isUpdated;
        }
        public string StatisticTopic(string topicid)
        {
            string retJson = string.Empty;
            string statisticSQL = string.Format("select * from Topic where id='{0}'", topicid);
            DataSet topicset = tf.sh.ExecuteDateSet(statisticSQL, null);
            if (topicset != null && topicset.Tables.Count > 0)
            {
                retJson = tf.GetCategoryList(topicset.Tables[0]);
            }
            return retJson;
        }
        /// <summary>
        /// 添加分析话题
        /// </summary>
        /// <param name="Name">Name</param>
        /// <param name="Keywords">Keywords</param>
        /// <param name="Industry">Industry</param>
        /// <returns></returns>
        public int AddTopicEntity(string Name, string Keywords, string Industry)
        {
            int identityid = 0;
            string addsql = string.Format(@"insert into Topic([Name],[Keywords],[StartTime],[Industry],[OriginalCount],[ForwardCount],[CommentCount],[IsStop],[IsDel],[JobState],[IsRead])
                                                        values('{0}','{1}',GETDATE(),'{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}') select @@IDENTITY go",
                                                           Name, Keywords, Industry, 0, 0, 0, 0, 0, 1, 0);
            try
            {

                identityid = Convert.ToInt32(tf.sh.ExecuteScalar(CommandType.Text, addsql, null));

            }
            catch (Exception ex)
            {
                // throw ex;
            }
            return identityid;

        }
    }
}
