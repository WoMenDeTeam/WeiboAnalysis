//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;

//namespace DBDAL.Entity
//{
//    class UserCollectEntity
//    {
//    }
//}



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
    public partial class UserCollectEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "UserCollect";
        public const string PrimaryKey = "PK_UserCollect";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string UserID = "UserID";
            public const string IdolID = "IdolID";
            public const string Title = "Title";
            public const string CollectTime = "CollectTime";
        }
        #endregion

        #region constructors
        public UserCollectEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public UserCollectEntity(int id, int userid, string idolid, string title, DateTime collecttime)
        {
            this.ID = id;

            this.UserID = userid;

            this.IdolID = idolid;

            this.Title = title;

            this.CollectTime = collecttime;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? UserID
        {
            get;
            set;
        }


        public string IdolID
        {
            get;
            set;
        }


        public string Title
        {
            get;
            set;
        }


        public DateTime? CollectTime
        {
            get;
            set;
        }

        #endregion

        public class UserCollectDAO : SqlDAO<UserCollectEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "SentimentConnStr";

            public UserCollectDAO()
            {
                sqlHelper = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
            }

            public override void Add(UserCollectEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into UserCollect(");
                strSql.Append("UserID,IdolID,Title,CollectTime)");
                strSql.Append(" values (");
                strSql.Append("@UserID,@IdolID,@Title,@CollectTime)");
                SqlParameter[] parameters = {
					new SqlParameter("@UserID",SqlDbType.Int),
					new SqlParameter("@IdolID",SqlDbType.VarChar),
					new SqlParameter("@Title",SqlDbType.NVarChar),
					new SqlParameter("@CollectTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.UserID;
                parameters[1].Value = entity.IdolID;
                parameters[2].Value = entity.Title;
                parameters[3].Value = entity.CollectTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(UserCollectEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update UserCollect set ");
                strSql.Append("UserID=@UserID,");
                strSql.Append("IdolID=@IdolID,");
                strSql.Append("Title=@Title,");
                strSql.Append("CollectTime=@CollectTime");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@UserID",SqlDbType.Int),
					new SqlParameter("@IdolID",SqlDbType.VarChar),
					new SqlParameter("@Title",SqlDbType.NVarChar),
					new SqlParameter("@CollectTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.UserID;
                parameters[2].Value = entity.IdolID;
                parameters[3].Value = entity.Title;
                parameters[4].Value = entity.CollectTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(UserCollectEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from UserCollect ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override UserCollectEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from UserCollect ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    UserCollectEntity entity = new UserCollectEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["UserID"]))
                    {
                        entity.UserID = (int)row["UserID"];
                    }
                    entity.IdolID = row["IdolID"].ToString();
                    entity.Title = row["Title"].ToString();
                    if (!Convert.IsDBNull(row["CollectTime"]))
                    {
                        entity.CollectTime = (DateTime)row["CollectTime"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<UserCollectEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM UserCollect(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<UserCollectEntity> list = new List<UserCollectEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        UserCollectEntity entity = new UserCollectEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["UserID"]))
                        {
                            entity.UserID = (int)row["UserID"];
                        }
                        entity.IdolID = row["IdolID"].ToString();
                        entity.Title = row["Title"].ToString();
                        if (!Convert.IsDBNull(row["CollectTime"]))
                        {
                            entity.CollectTime = (DateTime)row["CollectTime"];
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

            public DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM UserCollect(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
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
                string sql = "select count(*) from UserCollect ";
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

                sql += " AS RowNumber,* FROM UserCollect";

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

