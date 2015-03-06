using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class KeyWordsEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "KeyWords";
        public const string PrimaryKey = "PK_KeyWords";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string Name = "Name";
            public const string KWRelevance = "KWRelevance";
            public const string KeywordType = "KeywordType";
            public const string Tag = "Tag";
        }
        #endregion

        #region constructors
        public KeyWordsEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public KeyWordsEntity(int id, string name, int kwrelevance, int keywordtype, string tag)
        {
            this.ID = id;

            this.Name = name;

            this.KWRelevance = kwrelevance;

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


        public string Name
        {
            get;
            set;
        }


        public int? KWRelevance
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

        public class KeyWordsDAO : SqlDAO<KeyWordsEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";// Util.ConfigUtil.CacheUsreInfo.SqlDBKey;//"WeiboDBStr";

            public KeyWordsDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(KeyWordsEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into KeyWords(");
                strSql.Append("Name,KWRelevance,KeywordType,Tag)");
                strSql.Append(" values (");
                strSql.Append("@Name,@KWRelevance,@KeywordType,@Tag)");
                SqlParameter[] parameters = {
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@KWRelevance",SqlDbType.Int),
					new SqlParameter("@KeywordType",SqlDbType.Int),
					new SqlParameter("@Tag",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.Name;
                parameters[1].Value = entity.KWRelevance;
                parameters[2].Value = entity.KeywordType;
                parameters[3].Value = entity.Tag;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(KeyWordsEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update KeyWords set ");
                strSql.Append("Name=@Name,");
                strSql.Append("KWRelevance=@KWRelevance,");
                strSql.Append("KeywordType=@KeywordType,");
                strSql.Append("Tag=@Tag");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@KWRelevance",SqlDbType.Int),
					new SqlParameter("@KeywordType",SqlDbType.Int),
					new SqlParameter("@Tag",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.Name;
                parameters[2].Value = entity.KWRelevance;
                parameters[3].Value = entity.KeywordType;
                parameters[4].Value = entity.Tag;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(KeyWordsEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from KeyWords ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override KeyWordsEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from KeyWords ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    KeyWordsEntity entity = new KeyWordsEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.Name = row["Name"].ToString();
                    if (!Convert.IsDBNull(row["KWRelevance"]))
                    {
                        entity.KWRelevance = (int)row["KWRelevance"];
                    }
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

            public override List<KeyWordsEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM KeyWords(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<KeyWordsEntity> list = new List<KeyWordsEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        KeyWordsEntity entity = new KeyWordsEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.Name = row["Name"].ToString();
                        if (!Convert.IsDBNull(row["KWRelevance"]))
                        {
                            entity.KWRelevance = (int)row["KWRelevance"];
                        }
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
                strSql.Append(" FROM KeyWords(nolock)");
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
                string sql = "select count(*) from KeyWords ";
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

                sql += " AS RowNumber,* FROM KeyWords";

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

