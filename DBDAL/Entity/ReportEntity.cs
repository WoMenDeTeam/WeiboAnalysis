using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;
using System.Reflection;
using System.Text;
using DBDAL.Data;



namespace DBDAL.Entity
{
    [Serializable]
    public partial class reportEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "report";
        public const string PrimaryKey = "PK_report";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string authorName = "authorName";
            public const string profileImageUrl = "profileImageUrl";
            public const string referenceId = "referenceId";
            public const string dreContent = "dreContent";
            public const string thumbnailPic = "thumbnailPic";
            public const string weiboUrl = "weiboUrl";
            public const string siteName = "siteName";
            public const string timesTamp = "timesTamp";
            public const string forwardUrl = "forwardUrl";
            public const string forwardNum = "forwardNum";
            public const string replyUrl = "replyUrl";
            public const string replyNum = "replyNum";
            public const string initTime = "initTime";
        }
        #endregion

        #region constructors
        public reportEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public reportEntity(int id, string authorname, string profileimageurl, string referenceid, string drecontent, string thumbnailpic, string weibourl, string sitename, string timestamp, string forwardurl, string forwardnum, string replyurl, string replynum, DateTime inittime)
        {
            this.ID = id;

            this.authorName = authorname;

            this.profileImageUrl = profileimageurl;

            this.referenceId = referenceid;

            this.dreContent = drecontent;

            this.thumbnailPic = thumbnailpic;

            this.weiboUrl = weibourl;

            this.siteName = sitename;

            this.timesTamp = timestamp;

            this.forwardUrl = forwardurl;

            this.forwardNum = forwardnum;

            this.replyUrl = replyurl;

            this.replyNum = replynum;

            this.initTime = inittime;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string authorName
        {
            get;
            set;
        }


        public string profileImageUrl
        {
            get;
            set;
        }


        public string referenceId
        {
            get;
            set;
        }


        public string dreContent
        {
            get;
            set;
        }


        public string thumbnailPic
        {
            get;
            set;
        }


        public string weiboUrl
        {
            get;
            set;
        }


        public string siteName
        {
            get;
            set;
        }


        public string timesTamp
        {
            get;
            set;
        }


        public string forwardUrl
        {
            get;
            set;
        }


        public string forwardNum
        {
            get;
            set;
        }


        public string replyUrl
        {
            get;
            set;
        }


        public string replyNum
        {
            get;
            set;
        }


        public DateTime? initTime
        {
            get;
            set;
        }

        #endregion

        public class reportDAO : SqlDAO<reportEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "SentimentConnStr";

            public reportDAO()
            {
                sqlHelper = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
            }

            public override void Add(reportEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into report(");
                strSql.Append("authorName,profileImageUrl,referenceId,dreContent,thumbnailPic,weiboUrl,siteName,timesTamp,forwardUrl,forwardNum,replyUrl,replyNum,initTime)");
                strSql.Append(" values (");
                strSql.Append("@authorName,@profileImageUrl,@referenceId,@dreContent,@thumbnailPic,@weiboUrl,@siteName,@timesTamp,@forwardUrl,@forwardNum,@replyUrl,@replyNum,@initTime)");
                SqlParameter[] parameters = {
					new SqlParameter("@authorName",SqlDbType.NVarChar),
					new SqlParameter("@profileImageUrl",SqlDbType.NVarChar),
					new SqlParameter("@referenceId",SqlDbType.NVarChar),
					new SqlParameter("@dreContent",SqlDbType.NVarChar),
					new SqlParameter("@thumbnailPic",SqlDbType.NVarChar),
					new SqlParameter("@weiboUrl",SqlDbType.NVarChar),
					new SqlParameter("@siteName",SqlDbType.NVarChar),
					new SqlParameter("@timesTamp",SqlDbType.NVarChar),
					new SqlParameter("@forwardUrl",SqlDbType.NVarChar),
					new SqlParameter("@forwardNum",SqlDbType.NVarChar),
					new SqlParameter("@replyUrl",SqlDbType.NVarChar),
					new SqlParameter("@replyNum",SqlDbType.NVarChar),
					new SqlParameter("@initTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.authorName;
                parameters[1].Value = entity.profileImageUrl;
                parameters[2].Value = entity.referenceId;
                parameters[3].Value = entity.dreContent;
                parameters[4].Value = entity.thumbnailPic;
                parameters[5].Value = entity.weiboUrl;
                parameters[6].Value = entity.siteName;
                parameters[7].Value = entity.timesTamp;
                parameters[8].Value = entity.forwardUrl;
                parameters[9].Value = entity.forwardNum;
                parameters[10].Value = entity.replyUrl;
                parameters[11].Value = entity.replyNum;
                parameters[12].Value = entity.initTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(reportEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update report set ");
                strSql.Append("authorName=@authorName,");
                strSql.Append("profileImageUrl=@profileImageUrl,");
                strSql.Append("referenceId=@referenceId,");
                strSql.Append("dreContent=@dreContent,");
                strSql.Append("thumbnailPic=@thumbnailPic,");
                strSql.Append("weiboUrl=@weiboUrl,");
                strSql.Append("siteName=@siteName,");
                strSql.Append("timesTamp=@timesTamp,");
                strSql.Append("forwardUrl=@forwardUrl,");
                strSql.Append("forwardNum=@forwardNum,");
                strSql.Append("replyUrl=@replyUrl,");
                strSql.Append("replyNum=@replyNum,");
                strSql.Append("initTime=@initTime");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@authorName",SqlDbType.NVarChar),
					new SqlParameter("@profileImageUrl",SqlDbType.NVarChar),
					new SqlParameter("@referenceId",SqlDbType.NVarChar),
					new SqlParameter("@dreContent",SqlDbType.NVarChar),
					new SqlParameter("@thumbnailPic",SqlDbType.NVarChar),
					new SqlParameter("@weiboUrl",SqlDbType.NVarChar),
					new SqlParameter("@siteName",SqlDbType.NVarChar),
					new SqlParameter("@timesTamp",SqlDbType.NVarChar),
					new SqlParameter("@forwardUrl",SqlDbType.NVarChar),
					new SqlParameter("@forwardNum",SqlDbType.NVarChar),
					new SqlParameter("@replyUrl",SqlDbType.NVarChar),
					new SqlParameter("@replyNum",SqlDbType.NVarChar),
					new SqlParameter("@initTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.authorName;
                parameters[2].Value = entity.profileImageUrl;
                parameters[3].Value = entity.referenceId;
                parameters[4].Value = entity.dreContent;
                parameters[5].Value = entity.thumbnailPic;
                parameters[6].Value = entity.weiboUrl;
                parameters[7].Value = entity.siteName;
                parameters[8].Value = entity.timesTamp;
                parameters[9].Value = entity.forwardUrl;
                parameters[10].Value = entity.forwardNum;
                parameters[11].Value = entity.replyUrl;
                parameters[12].Value = entity.replyNum;
                parameters[13].Value = entity.initTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(reportEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from report ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override reportEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from report ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    reportEntity entity = new reportEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.authorName = row["authorName"].ToString();
                    entity.profileImageUrl = row["profileImageUrl"].ToString();
                    entity.referenceId = row["referenceId"].ToString();
                    entity.dreContent = row["dreContent"].ToString();
                    entity.thumbnailPic = row["thumbnailPic"].ToString();
                    entity.weiboUrl = row["weiboUrl"].ToString();
                    entity.siteName = row["siteName"].ToString();
                    entity.timesTamp = row["timesTamp"].ToString();
                    entity.forwardUrl = row["forwardUrl"].ToString();
                    entity.forwardNum = row["forwardNum"].ToString();
                    entity.replyUrl = row["replyUrl"].ToString();
                    entity.replyNum = row["replyNum"].ToString();
                    if (!Convert.IsDBNull(row["initTime"]))
                    {
                        entity.initTime = (DateTime)row["initTime"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<reportEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM report(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<reportEntity> list = new List<reportEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        reportEntity entity = new reportEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.authorName = row["authorName"].ToString();
                        entity.profileImageUrl = row["profileImageUrl"].ToString();
                        entity.referenceId = row["referenceId"].ToString();
                        entity.dreContent = row["dreContent"].ToString();
                        entity.thumbnailPic = row["thumbnailPic"].ToString();
                        entity.weiboUrl = row["weiboUrl"].ToString();
                        entity.siteName = row["siteName"].ToString();
                        entity.timesTamp = row["timesTamp"].ToString();
                        entity.forwardUrl = row["forwardUrl"].ToString();
                        entity.forwardNum = row["forwardNum"].ToString();
                        entity.replyUrl = row["replyUrl"].ToString();
                        entity.replyNum = row["replyNum"].ToString();
                        if (!Convert.IsDBNull(row["initTime"]))
                        {
                            entity.initTime = (DateTime)row["initTime"];
                        }

                        list.Add(entity);
                    }

                    return list;
                }
                else
                {
                    return null;
                }
            }

            public override DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM report(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }

            public  DataSet GetDataSet(string strWhere, string orderby, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM report(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                if (string.IsNullOrEmpty(orderby))
                {
                    strSql.Append(" ORDER BY initTime DESC ");
                }
                else
                {
                    strSql.AppendFormat(" ORDER BY {0} ", orderby);
                }

                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from report ";
                if (!string.IsNullOrEmpty(where))
                {
                    sql += "where " + where;
                }

                object obj = sqlHelper.GetSingle(sql, param);

                return obj == null ? 0 : Convert.ToInt32(obj);
            }

            /// <summary>
            /// 查询分页信息，返回当前页码的记录集
            /// </summary>
            /// <param name="where">查询条件，可为empty</param>
            /// <param name="orderBy">排序条件，可为empty</param>
            /// <param name="pageSize">每页显示记录数</param>
            /// <param name="pageNumber">当前页码</param>
            /// <returns>datatable</returns>
            public DataTable GetPager(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
            {
                int startNumber = pageSize * (pageNumber - 1);

                string sql = string.Format("SELECT TOP {0} * FROM (SELECT ROW_NUMBER() OVER", pageSize);

                if (!string.IsNullOrEmpty(orderBy))
                {
                    sql += string.Format(" (ORDER BY {0})", orderBy);
                }
                else
                {

                    sql += " (ORDER BY ID)";//默认按主键排序

                }

                sql += " AS RowNumber,* FROM report";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            #endregion

        }
    }
}



