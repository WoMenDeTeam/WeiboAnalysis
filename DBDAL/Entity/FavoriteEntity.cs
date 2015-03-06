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
    public partial class FavoriteEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "Favorite";
        public const string PrimaryKey = "PK_Favorite";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string MainID = "MainID";
            public const string InsertTime = "InsertTime";
            public const string UserId = "UserId";
        }
        #endregion

        #region constructors
        public FavoriteEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public FavoriteEntity(int id, int mainid, DateTime inserttime, int userId)
        {
            this.ID = id;

            this.MainID = mainid;

            this.InsertTime = inserttime;
            this.UserId = userId;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? MainID
        {
            get;
            set;
        }


        public DateTime? InsertTime
        {
            get;
            set;
        }
        public int UserId { get; set; }

        #endregion

        public class FavoriteDAO : SqlDAO<FavoriteEntity>
        {
            private SqlHelper sqlHelper;
            //public const string DBName =  //"WeiboDBStr";

            public FavoriteDAO()
            {
                sqlHelper = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
            }

            public override void Add(FavoriteEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into Favorite(");
                strSql.Append("MainID,InsertTime,UserId)");
                strSql.Append(" values (");
                strSql.Append("@MainID,@InsertTime,@UserId)");
                SqlParameter[] parameters = {
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
                    new SqlParameter("@UserId",SqlDbType.Int)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.InsertTime;
                parameters[2].Value = entity.UserId;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(FavoriteEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update Favorite set ");
                strSql.Append("MainID=@MainID,");
                strSql.Append("InsertTime=@InsertTime");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.MainID;
                parameters[2].Value = entity.InsertTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }
            //updated by: Tony, content: Del where by MainID
            public override void Delete(FavoriteEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Favorite ");
                strSql.Append(" where MainID=@primaryKeyId And UserId=@UserId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int),
                        new SqlParameter("@UserId",SqlDbType.Int)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.UserId;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);

            }
            public int DeleteByWhere(string where)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Favorite ");
                strSql.Append(" where MainID in(" + where + ")");
                return sqlHelper.ExecuteSql(strSql.ToString(), null);
            }

            public override FavoriteEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from Favorite ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    FavoriteEntity entity = new FavoriteEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["MainID"]))
                    {
                        entity.MainID = (int)row["MainID"];
                    }
                    if (!Convert.IsDBNull(row["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)row["InsertTime"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<FavoriteEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Favorite(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<FavoriteEntity> list = new List<FavoriteEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        FavoriteEntity entity = new FavoriteEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["MainID"]))
                        {
                            entity.MainID = (int)row["MainID"];
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

            public DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Favorite(nolock)");
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
                string sql = "select count(*) from Favorite ";
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

                sql += " AS RowNumber,* FROM Favorite";

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

