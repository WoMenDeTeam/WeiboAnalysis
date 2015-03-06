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
    public partial class keywords2Entity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "keywords2";
        public const string PrimaryKey = "PK__keywords2__DFDFDF3E164452B1";
        #endregion

        #region columns
        public struct Columns
        {
            public const string kid = "kid";
            public const string title = "title";
            public const string keyword = "keyword";
        }
        #endregion

        #region constructors
        public keywords2Entity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public keywords2Entity(int kid, string title, string keyword)
        {
            this.kid = kid;

            this.title = title;

            this.keyword = keyword;

        }
        #endregion

        #region Properties

        public int? kid
        {
            get;
            set;
        }


        public string title
        {
            get;
            set;
        }


        public string keyword
        {
            get;
            set;
        }

        #endregion

        public class keywords2DAO : SqlDAO<keywords2Entity>
        {
            private SqlHelper sqlHelper;

            public keywords2DAO()
            {
                sqlHelper = new SqlHelper("WeiboDBStr");
            }

            public override void Add(keywords2Entity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into keywords2(");
                strSql.Append("title,keyword)");
                strSql.Append(" values (");
                strSql.Append("@title,@keyword)");
                SqlParameter[] parameters = {
					new SqlParameter("@title",SqlDbType.NVarChar),
					new SqlParameter("@keyword",SqlDbType.NVarChar)
					};
                parameters[0].Value = entity.title;
                parameters[1].Value = entity.keyword;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(keywords2Entity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update keywords2 set ");
                strSql.Append("title=@title,");
                strSql.Append("keyword=@keyword");

                strSql.Append(" where kid=@kid");
                SqlParameter[] parameters = {
					new SqlParameter("@kid",SqlDbType.Int),
					new SqlParameter("@title",SqlDbType.NVarChar),
					new SqlParameter("@keyword",SqlDbType.NVarChar)
					};
                parameters[0].Value = entity.kid;
                parameters[1].Value = entity.title;
                parameters[2].Value = entity.keyword;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(keywords2Entity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from keywords2 ");
                strSql.Append(" where kid=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.kid;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override keywords2Entity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from keywords2 ");
                strSql.Append(" where kid=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    keywords2Entity entity = new keywords2Entity();
                    if (!Convert.IsDBNull(row["kid"]))
                    {
                        entity.kid = (int)row["kid"];
                    }
                    entity.title = row["title"].ToString();
                    entity.keyword = row["keyword"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<keywords2Entity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM keywords2(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<keywords2Entity> list = new List<keywords2Entity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        keywords2Entity entity = new keywords2Entity();
                        if (!Convert.IsDBNull(row["kid"]))
                        {
                            entity.kid = (int)row["kid"];
                        }
                        entity.title = row["title"].ToString();
                        entity.keyword = row["keyword"].ToString();

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
                strSql.Append(" FROM keywords2(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }
            /// <summary>
            /// 删除/忽略标记
            /// </summary>
            /// <param name="refIds"></param>
            /// <param name="act">1-删除2-忽略标记</param>
            public void MarkOperate(string refIds, int act)
            {
                StringBuilder sqlBuder = new StringBuilder();
                string[] refid = refIds.Split(',');
                for (int i = 0; i < refid.Length; i++)
                {
                    sqlBuder.AppendFormat(@" 
                            IF NOT EXISTS( SELECT dbo.OptState.MainID FROM dbo.OptState WHERE dbo.OptState.MainID={0} )
                            INSERT INTO dbo.OptState ( MainID, State ) VALUES ({0},{1}) 
                            
                            ", refid[i], act);

                }
                sqlHelper.ExecuteSql(sqlBuder.ToString());
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from keywords2 ";
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

                    sql += " (ORDER BY kid)";//默认按主键排序

                }

                sql += " AS RowNumber,* FROM keywords2";

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
