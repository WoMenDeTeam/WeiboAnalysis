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
    public partial class TopicItemEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "TopicItem";
        public const string PrimaryKey = "PK_TopicItem";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string TopicID = "TopicID";
            public const string MainID = "MainID";
            public const string ItemID = "ItemID";
            public const string WebSource = "WebSource";
        }
        #endregion

        #region constructors
        public TopicItemEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public TopicItemEntity(int id, int topicid, int mainid, long itemid, int websource)
        {
            this.ID = id;

            this.TopicID = topicid;

            this.MainID = mainid;

            this.ItemID = itemid;

            this.WebSource = websource;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? TopicID
        {
            get;
            set;
        }


        public int? MainID
        {
            get;
            set;
        }


        public long? ItemID
        {
            get;
            set;
        }


        public int? WebSource
        {
            get;
            set;
        }

        #endregion

        public class TopicItemDAO : SqlDAO<TopicItemEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";// Util.ConfigUtil.CacheUsreInfo.SqlDBKey;//"WeiboDBStr";

            public TopicItemDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(TopicItemEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into TopicItem(");
                strSql.Append("TopicID,MainID,ItemID,WebSource)");
                strSql.Append(" values (");
                strSql.Append("@TopicID,@MainID,@ItemID,@WebSource)");
                SqlParameter[] parameters = {
					new SqlParameter("@TopicID",SqlDbType.Int),
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@ItemID",SqlDbType.BigInt),
					new SqlParameter("@WebSource",SqlDbType.Int)
					};
                parameters[0].Value = entity.TopicID;
                parameters[1].Value = entity.MainID;
                parameters[2].Value = entity.ItemID;
                parameters[3].Value = entity.WebSource;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(TopicItemEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update TopicItem set ");
                strSql.Append("TopicID=@TopicID,");
                strSql.Append("MainID=@MainID,");
                strSql.Append("ItemID=@ItemID,");
                strSql.Append("WebSource=@WebSource");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@TopicID",SqlDbType.Int),
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@ItemID",SqlDbType.BigInt),
					new SqlParameter("@WebSource",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.TopicID;
                parameters[2].Value = entity.MainID;
                parameters[3].Value = entity.ItemID;
                parameters[4].Value = entity.WebSource;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(TopicItemEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from TopicItem ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public void DeleteByWhere(int topicid, string sqlWhere)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from TopicItem ");
                strSql.Append(" where TopicID = " + topicid);
                strSql.Append(" and MainID in(" + sqlWhere + ")");
                sqlHelper.ExecuteSql(strSql.ToString(), null);
            }


            public override TopicItemEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from TopicItem ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    TopicItemEntity entity = new TopicItemEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["TopicID"]))
                    {
                        entity.TopicID = (int)row["TopicID"];
                    }
                    if (!Convert.IsDBNull(row["MainID"]))
                    {
                        entity.MainID = (int)row["MainID"];
                    }
                    if (!Convert.IsDBNull(row["ItemID"]))
                    {
                        entity.ItemID = (long)row["ItemID"];
                    }
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<TopicItemEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM TopicItem(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<TopicItemEntity> list = new List<TopicItemEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        TopicItemEntity entity = new TopicItemEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["TopicID"]))
                        {
                            entity.TopicID = (int)row["TopicID"];
                        }
                        if (!Convert.IsDBNull(row["MainID"]))
                        {
                            entity.MainID = (int)row["MainID"];
                        }
                        if (!Convert.IsDBNull(row["ItemID"]))
                        {
                            entity.ItemID = (long)row["ItemID"];
                        }
                        if (!Convert.IsDBNull(row["WebSource"]))
                        {
                            entity.WebSource = (int)row["WebSource"];
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
            public List<TopicItemEntity> FindByTopicId(int topicId)
            {
                SqlParameter[] parameter ={
                               new SqlParameter("@topicId",SqlDbType.Int)
                           };
                parameter[0].Value = topicId;
                return Find(" TopicID = @topicId", parameter);
            }

            public DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM TopicItem(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }

            public int Add(string values)
            {
                StringBuilder sqlBud = new StringBuilder();
                sqlBud.Append(" INSERT dbo.TopicItem( TopicID, MainID, ItemID, WebSource )");
                sqlBud.Append(" VALUES ");
                sqlBud.Append(values);
                return sqlHelper.ExecuteSql(sqlBud.ToString(), null);
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from TopicItem ";
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

                sql += " AS RowNumber,* FROM TopicItem";

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

