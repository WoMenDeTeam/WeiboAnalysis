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
    public partial class FavoriteStateEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "FavoriteState";
        public const string PrimaryKey = "PK_FavoriteState";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string MainID = "MainID";
            public const string State = "State";
        }
        #endregion

        #region constructors
        public FavoriteStateEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public FavoriteStateEntity(int id, int mainid, int state)
        {
            this.ID = id;

            this.MainID = mainid;

            this.State = state;

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


        public int? State
        {
            get;
            set;
        }

        #endregion

        public class FavoriteStateDAO : SqlDAO<FavoriteStateEntity>
        {
            private SqlHelper sqlHelper;
           // public const string DBName = Util.ConfigUtil.CacheUsreInfo.SqlDBKey;// "WeiboDBStr";

            public FavoriteStateDAO()
            {
                sqlHelper = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
            }

            public override void Add(FavoriteStateEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into FavoriteState(");
                strSql.Append("MainID,State)");
                strSql.Append(" values (");
                strSql.Append("@MainID,@State)");
                SqlParameter[] parameters = {
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@State",SqlDbType.Int)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.State;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(FavoriteStateEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update FavoriteState set ");
                strSql.Append("State=@State");

                strSql.Append(" where MainID=@mainId");
                SqlParameter[] parameters = {
					new SqlParameter("@mainId",SqlDbType.Int),
					new SqlParameter("@State",SqlDbType.Int)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.State;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }
            public void UpdateByWhere(string ids, int state)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update FavoriteState set ");
                strSql.Append("State=@State");

                strSql.Append(" where MainID in(" + ids + ")");
                SqlParameter[] parameters = {
					new SqlParameter("@State",SqlDbType.Int)
					};
                parameters[0].Value = state;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(FavoriteStateEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from FavoriteState ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override FavoriteStateEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from FavoriteState ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    FavoriteStateEntity entity = new FavoriteStateEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["MainID"]))
                    {
                        entity.MainID = (int)row["MainID"];
                    }
                    if (!Convert.IsDBNull(row["State"]))
                    {
                        entity.State = (int)row["State"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }
            public FavoriteStateEntity FindByMainID(int mainId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from FavoriteState ");
                strSql.Append(" where MainID=@mainId");
                SqlParameter[] parameters = {
						new SqlParameter("@mainId", SqlDbType.Int)};
                parameters[0].Value = mainId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    FavoriteStateEntity entity = new FavoriteStateEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["MainID"]))
                    {
                        entity.MainID = (int)row["MainID"];
                    }
                    if (!Convert.IsDBNull(row["State"]))
                    {
                        entity.State = (int)row["State"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<FavoriteStateEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM FavoriteState(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<FavoriteStateEntity> list = new List<FavoriteStateEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        FavoriteStateEntity entity = new FavoriteStateEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["MainID"]))
                        {
                            entity.MainID = (int)row["MainID"];
                        }
                        if (!Convert.IsDBNull(row["State"]))
                        {
                            entity.State = (int)row["State"];
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
                strSql.Append(" FROM FavoriteState(nolock)");
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
                string sql = "select count(*) from FavoriteState ";
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

                sql += " AS RowNumber,* FROM FavoriteState";

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

