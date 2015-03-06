using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Data;
using System.Data.SqlClient;
using System.Data;

namespace DBDAL.Entity
{
    public class AccidentReportEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Sentiment";
        public const string TableName = "AccidentReport";
        public const string PrimaryKey = "PK_AccidentReport";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string Title = "Title";
            public const string Content = "Content";
            public const string Url = "Url";
            public const string Department = "Department";
            public const string State = "State";
            public const string PublishTime = "PublishTime";
            public const string CreateTime = "CreateTime";
            public const string OccurrenceTime = "OccurrenceTime";
            public const string AccidentLevel = "AccidentLevel";
            public const string RegulatoryDepartment = "RegulatoryDepartment";
            public const string Area = "Area";
        }
        #endregion

        #region constructors
        public AccidentReportEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public AccidentReportEntity(int id, string title, string content, string url, string department, int state, DateTime publishtime, DateTime createtime, DateTime occurrenceTime, string accidentlevel, string regulatorydepartment, string area)
        {
            this.ID = id;
            this.Title = title;
            this.Content = content;
            this.Url = url;
            this.Department = department;
            this.State = state;
            this.PublishTime = publishtime;
            this.CreateTime = createtime;
            this.OccurrenceTime = occurrenceTime;
            this.AccidentLevel = accidentlevel;
            this.Area = area;
            this.RegulatoryDepartment = regulatorydepartment;
        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }
        public string Title
        {
            get;
            set;
        }
        public string Content
        {
            get;
            set;
        }
        public string Url
        {
            get;
            set;
        }
        public string Department
        {
            get;
            set;
        }
        public int? State
        {
            get;
            set;
        }
        public DateTime? PublishTime
        {
            get;
            set;
        }
        public DateTime? CreateTime
        {
            get;
            set;
        }
        public DateTime? OccurrenceTime
        {
            get;
            set;
        }
        public string AccidentLevel { get; set; }
        public string RegulatoryDepartment { get; set; }
        public string Area { get; set; }
        #endregion

        public class AccidentReportDAO : SqlDAO<AccidentReportEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public AccidentReportDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(AccidentReportEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into AccidentReport(");
                strSql.Append("Title,Content,Url,Department,State,PublishTime,CreateTime,OccurrenceTime,AccidentLevel,RegulatoryDepartment,Area)");
                strSql.Append(" values (");
                strSql.Append("@Title,@Content,@Url,@Department,@State,@PublishTime,@CreateTime,@OccurrenceTime,@AccidentLevel,@RegulatoryDepartment,@Area)");
                SqlParameter[] parameters = {
					new SqlParameter("@Title",SqlDbType.NVarChar),
					new SqlParameter("@Content",SqlDbType.NVarChar),
					new SqlParameter("@Url",SqlDbType.VarChar),
					new SqlParameter("@Department",SqlDbType.NVarChar),
					new SqlParameter("@State",SqlDbType.Int),
					new SqlParameter("@PublishTime",SqlDbType.DateTime),
					new SqlParameter("@CreateTime",SqlDbType.DateTime),
                    new SqlParameter("@OccurrenceTime",SqlDbType.DateTime),
                    new SqlParameter("@AccidentLevel",SqlDbType.VarChar),
                    new SqlParameter("@RegulatoryDepartment",SqlDbType.VarChar),
                    new SqlParameter("@Area",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.Title;
                parameters[1].Value = entity.Content;
                parameters[2].Value = entity.Url;
                parameters[3].Value = entity.Department;
                parameters[4].Value = entity.State;
                parameters[5].Value = entity.PublishTime;
                parameters[6].Value = entity.CreateTime;
                parameters[7].Value = entity.OccurrenceTime;
                parameters[8].Value = entity.AccidentLevel;
                parameters[9].Value = entity.RegulatoryDepartment;
                parameters[10].Value = entity.Area;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(AccidentReportEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("update AccidentReport set ");
                strSql.Append("Title=@Title,");
                strSql.Append("Content=@Content,");
                strSql.Append("Url=@Url,");
                strSql.Append("Department=@Department,");
                strSql.Append("State=@State,");
                strSql.Append("PublishTime=@PublishTime,");
                strSql.Append("CreateTime=@CreateTime,");
                strSql.Append("OccurrenceTime=@OccurrenceTime,");
                strSql.Append("AccidentLevel=@AccidentLevel,");
                strSql.Append("RegulatoryDepartment=@RegulatoryDepartment,");
                strSql.Append("Area=@Area");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@Title",SqlDbType.NVarChar),
					new SqlParameter("@Content",SqlDbType.NVarChar),
					new SqlParameter("@Url",SqlDbType.VarChar),
					new SqlParameter("@Department",SqlDbType.NVarChar),
					new SqlParameter("@State",SqlDbType.Int),
					new SqlParameter("@PublishTime",SqlDbType.DateTime),
					new SqlParameter("@CreateTime",SqlDbType.DateTime),
                    new SqlParameter("@OccurrenceTime",SqlDbType.DateTime),
                    new  SqlParameter("@AccidentLevel",SqlDbType.VarChar),
                    new  SqlParameter("@RegulatoryDepartment",SqlDbType.VarChar),
                    new SqlParameter("@Area",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.Title;
                parameters[2].Value = entity.Content;
                parameters[3].Value = entity.Url;
                parameters[4].Value = entity.Department;
                parameters[5].Value = entity.State;
                parameters[6].Value = entity.PublishTime;
                parameters[7].Value = entity.CreateTime;
                parameters[8].Value = entity.OccurrenceTime;
                parameters[9].Value = entity.AccidentLevel;
                parameters[10].Value = entity.RegulatoryDepartment;
                parameters[11].Value = entity.Area;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(AccidentReportEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from AccidentReport ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }
            public void DeleteByids(string ids, int state)
            {
                string sql = string.Format("UPDATE dbo.AccidentReport SET State={0} WHERE ID IN ({1})", state, ids);
                sqlHelper.ExecuteSql(sql, null);
            }

            public override AccidentReportEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from AccidentReport ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    AccidentReportEntity entity = new AccidentReportEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.Title = row["Title"].ToString();
                    entity.Content = row["Content"].ToString();
                    entity.Url = row["Url"].ToString();
                    entity.Department = row["Department"].ToString();
                    if (!Convert.IsDBNull(row["State"]))
                    {
                        entity.State = (int)row["State"];
                    }
                    if (!Convert.IsDBNull(row["PublishTime"]))
                    {
                        entity.PublishTime = (DateTime)row["PublishTime"];
                    }
                    if (!Convert.IsDBNull(row["CreateTime"]))
                    {
                        entity.CreateTime = (DateTime)row["CreateTime"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<AccidentReportEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM AccidentReport(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<AccidentReportEntity> list = new List<AccidentReportEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        AccidentReportEntity entity = new AccidentReportEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.Title = row["Title"].ToString();
                        entity.Content = row["Content"].ToString();
                        entity.Url = row["Url"].ToString();
                        entity.Department = row["Department"].ToString();
                        if (!Convert.IsDBNull(row["State"]))
                        {
                            entity.State = (int)row["State"];
                        }
                        if (!Convert.IsDBNull(row["PublishTime"]))
                        {
                            entity.PublishTime = (DateTime)row["PublishTime"];
                        }
                        if (!Convert.IsDBNull(row["CreateTime"]))
                        {
                            entity.CreateTime = (DateTime)row["CreateTime"];
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
                strSql.Append(" FROM AccidentReport(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                strSql.Append(" Order by CreateTime DESC ");
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
                string sql = "select count(*) from AccidentReport ";
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

                sql += " AS RowNumber,* FROM AccidentReport";

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
