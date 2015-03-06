using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Data;
using DBDAL.Entity;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class FollowerEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "Follower";
        public const string PrimaryKey = "PK_Follower";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string UserName = "UserName";
            public const string Nick = "Nick";
            public const string WebSource = "WebSource";
            public const string InsertTime = "InsertTime";
            public const string GroupID = "GroupID";
        }
        #endregion

        #region constructors
        public FollowerEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public FollowerEntity(int id, string username, string nick, int websource, DateTime inserttime, int groupid)
        {
            this.ID = id;

            this.UserName = username;

            this.Nick = nick;

            this.WebSource = websource;

            this.InsertTime = inserttime;

            this.GroupID = groupid;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string UserName
        {
            get;
            set;
        }


        public string Nick
        {
            get;
            set;
        }


        public int? WebSource
        {
            get;
            set;
        }


        public DateTime? InsertTime
        {
            get;
            set;
        }


        public int? GroupID
        {
            get;
            set;
        }

        #endregion

        public class FollowerDAO : SqlDAO<FollowerEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";// Util.ConfigUtil.CacheUsreInfo.SqlDBKey;// "WeiboDBStr";

            public FollowerDAO()
            {
                //string dbname = Util.ConfigUtil.CacheUsreInfo.SqlDBKey();
                //if (string.IsNullOrEmpty(s))
                //{
                //    dbname = DBName;
                //}

                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(FollowerEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into Follower(");
                strSql.Append("UserName,Nick,WebSource,InsertTime)");
                strSql.Append(" values (");
                strSql.Append("@UserName,@Nick,@WebSource,@InsertTime)");
                SqlParameter[] parameters = {
					new SqlParameter("@UserName",SqlDbType.VarChar),
					new SqlParameter("@Nick",SqlDbType.VarChar),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime)//,
                   // new SqlParameter("@GroupID",SqlDbType.Int)
					};
                parameters[0].Value = entity.UserName;
                parameters[1].Value = entity.Nick;
                parameters[2].Value = entity.WebSource;
                parameters[3].Value = entity.InsertTime;
                //  parameters[4].Value = entity.GroupID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public void ResetGroupId(int groupid)
            {
                string sql = string.Format(" UPDATE dbo.Follower SET GroupID=0 WHERE GroupID={0}", groupid);
                sqlHelper.ExecuteSql(sql, null);
            }
            public override void Update(FollowerEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update Follower set ");
                strSql.Append("UserName=@UserName,");
                strSql.Append("Nick=@Nick,");
                strSql.Append("WebSource=@WebSource,");
                strSql.Append("InsertTime=@InsertTime,");
                strSql.Append("GroupID=@GroupID");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@UserName",SqlDbType.VarChar),
					new SqlParameter("@Nick",SqlDbType.VarChar),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
                    new  SqlParameter("@GroupID",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.UserName;
                parameters[2].Value = entity.Nick;
                parameters[3].Value = entity.WebSource;
                parameters[4].Value = entity.InsertTime;
                parameters[5].Value = entity.GroupID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(FollowerEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Follower ");
                strSql.Append(" where UserName=@userName and WebSource=@webSource");
                SqlParameter[] parameters = {
						new SqlParameter("@userName", SqlDbType.VarChar),
                        new SqlParameter("@webSource",SqlDbType.Int)

					};
                parameters[0].Value = entity.UserName;
                parameters[1].Value = entity.WebSource;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }
            public void Delete(int id)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Follower ");
                strSql.Append(" where id=@id");
                SqlParameter[] parameters = {
						new SqlParameter("@id", SqlDbType.Int),
					};
                parameters[0].Value = id;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override FollowerEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from Follower ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    FollowerEntity entity = new FollowerEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.UserName = row["UserName"].ToString();
                    entity.Nick = row["Nick"].ToString();
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    if (!Convert.IsDBNull(row["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)row["InsertTime"];
                    }
                    if (!Convert.IsDBNull(row["GroupID"]))
                    {
                        entity.GroupID = Convert.ToInt32(row["GroupID"]);
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<FollowerEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Follower(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<FollowerEntity> list = new List<FollowerEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        FollowerEntity entity = new FollowerEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.UserName = row["UserName"].ToString();
                        entity.Nick = row["Nick"].ToString();
                        if (!Convert.IsDBNull(row["WebSource"]))
                        {
                            entity.WebSource = (int)row["WebSource"];
                        }
                        if (!Convert.IsDBNull(row["InsertTime"]))
                        {
                            entity.InsertTime = (DateTime)row["InsertTime"];
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

            public void SetUserGroup(int gid, string ids)
            {
                string sql = string.Format("UPDATE dbo.Follower SET GroupID={0} WHERE  ID IN({1})", gid, ids);
                sqlHelper.ExecuteSql(sql, null);
            }
            public DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Follower(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }

            //重载方法
            public FollowerEntity FindByUserName(string userName, int webSource)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from Follower ");
                strSql.Append(" where UserName=@userName and WebSource=@webSource");
                SqlParameter[] parameters = {
						new SqlParameter("@userName", SqlDbType.VarChar),
                                            new SqlParameter("@webSource",SqlDbType.Int)
                                            };
                parameters[0].Value = userName;
                parameters[1].Value = webSource;
                var excutReader = sqlHelper.ExecuteReader("", null);
                FollowerEntity entity = null;
                while (excutReader.Read())
                {
                    entity = new FollowerEntity();
                    if (!Convert.IsDBNull(excutReader["ID"]))
                    {
                        entity.ID = (int)excutReader["ID"];
                    }
                    entity.UserName = excutReader["UserName"].ToString();
                    entity.Nick = excutReader["Nick"].ToString();
                    if (!Convert.IsDBNull(excutReader["WebSource"]))
                    {
                        entity.WebSource = (int)excutReader["WebSource"];
                    }
                    if (!Convert.IsDBNull(excutReader["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)excutReader["InsertTime"];
                    }

                }
                excutReader.Close();
                excutReader.Dispose();
                return entity;

            }
            public FollowerEntity FindByUserName(string userName, string webSource)
            {
                return FindByUserName(userName, string.IsNullOrEmpty(webSource) ? 0 : int.Parse(webSource));
            }


            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from Follower ";
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

                sql += " AS RowNumber,* FROM Follower";

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

