using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class AlarmKeywordsEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "AlarmKeywords";
        public const string PrimaryKey = "PK_AlarmKeywords";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string Keyword = "Keyword";
            public const string KeywordType = "KeywordType";
            public const string Tag = "Tag";
        }
        #endregion

        #region constructors
        public AlarmKeywordsEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public AlarmKeywordsEntity(int id, string keyword, int keywordtype, string tag)
        {
            this.ID = id;

            this.Keyword = keyword;

            this.KeywordType = keywordtype;

            this.Tag = tag;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string Keyword
        {
            get;
            set;
        }


        public int? KeywordType
        {
            get;
            set;
        }


        public string Tag
        {
            get;
            set;
        }

        #endregion

        public class AlarmKeywordsDAO : SqlDAO<AlarmKeywordsEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public AlarmKeywordsDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(AlarmKeywordsEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into AlarmKeywords(");
                strSql.Append("Keyword,KeywordType,Tag)");
                strSql.Append(" values (");
                strSql.Append("@Keyword,@KeywordType,@Tag)");
                SqlParameter[] parameters = {
					new SqlParameter("@Keyword",SqlDbType.VarChar),
					new SqlParameter("@KeywordType",SqlDbType.Int),
					new SqlParameter("@Tag",SqlDbType.NChar)
					};
                parameters[0].Value = entity.Keyword;
                parameters[1].Value = entity.KeywordType;
                parameters[2].Value = entity.Tag;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(AlarmKeywordsEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update AlarmKeywords set ");
                strSql.Append("Keyword=@Keyword,");
                strSql.Append("KeywordType=@KeywordType,");
                strSql.Append("Tag=@Tag");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@Keyword",SqlDbType.VarChar),
					new SqlParameter("@KeywordType",SqlDbType.Int),
					new SqlParameter("@Tag",SqlDbType.NChar)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.Keyword;
                parameters[2].Value = entity.KeywordType;
                parameters[3].Value = entity.Tag;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(AlarmKeywordsEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from AlarmKeywords ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override AlarmKeywordsEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from AlarmKeywords ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    AlarmKeywordsEntity entity = new AlarmKeywordsEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.Keyword = row["Keyword"].ToString();
                    if (!Convert.IsDBNull(row["KeywordType"]))
                    {
                        entity.KeywordType = (int)row["KeywordType"];
                    }
                    entity.Tag = row["Tag"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<AlarmKeywordsEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM AlarmKeywords(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<AlarmKeywordsEntity> list = new List<AlarmKeywordsEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        AlarmKeywordsEntity entity = new AlarmKeywordsEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.Keyword = row["Keyword"].ToString();
                        if (!Convert.IsDBNull(row["KeywordType"]))
                        {
                            entity.KeywordType = (int)row["KeywordType"];
                        }
                        entity.Tag = row["Tag"].ToString();

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
                strSql.Append(" FROM AlarmKeywords(nolock)");
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
                string sql = "select count(*) from AlarmKeywords ";
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

                sql += " AS RowNumber,* FROM AlarmKeywords";

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
