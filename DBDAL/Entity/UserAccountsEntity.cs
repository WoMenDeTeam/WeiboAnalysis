using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using DBDAL.Data;
using System.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class UserAccountsEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Sentiment";
        public const string TableName = "UserAccounts";
        public const string PrimaryKey = "PK_UserAccounts";
        #endregion

        #region columns
        public struct Columns
        {
            public const string USERID = "USERID";
            public const string USERNAME = "USERNAME";
            public const string PASSWORD = "PASSWORD";
            public const string EMAIL = "EMAIL";
            public const string CREATEDATE = "CREATEDATE";
            public const string LASTLOGINDATE = "LASTLOGINDATE";
            public const string MOBILE = "MOBILE";
            public const string LASTLOGINIP = "LASTLOGINIP";
            public const string ORGTAG = "ORGTAG";
            public const string Power = "Power";
        }
        #endregion

        #region constructors
        public UserAccountsEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public UserAccountsEntity(int userid, string username, string password, string email, DateTime createdate, DateTime lastlogindate, string mobile, string lastloginip, string orgTag, int power)
        {
            this.USERID = userid;

            this.USERNAME = username;

            this.PASSWORD = password;

            this.EMAIL = email;

            this.CREATEDATE = createdate;

            this.LASTLOGINDATE = lastlogindate;

            this.MOBILE = mobile;

            this.LASTLOGINIP = lastloginip;
            this.ORGTAG = orgTag;
            this.Power = power;


        }
        #endregion

        #region Properties

        public int USERID
        {
            get;
            set;
        }


        public string USERNAME
        {
            get;
            set;
        }


        public string PASSWORD
        {
            get;
            set;
        }


        public string EMAIL
        {
            get;
            set;
        }


        public DateTime? CREATEDATE
        {
            get;
            set;
        }


        public DateTime? LASTLOGINDATE
        {
            get;
            set;
        }
        public string MOBILE
        {
            get;
            set;
        }
        public string LASTLOGINIP
        {
            get;
            set;
        }
        public string ORGTAG { get; set; }
        public int Power { get; set; }
        public string RealName { get; set; }
        public string DepartmentName { get; set; }
        public string DefaultPath { get; set; }
        #endregion

        public class UserAccountsDAO : SqlDAO<UserAccountsEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";//"WeiboUserStr";

            public UserAccountsDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(UserAccountsEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into UserAccounts(");
                strSql.Append("USERNAME,PASSWORD,EMAIL,CREATEDATE,LASTLOGINDATE,MOBILE,LASTLOGINIP,ORGTAG,RealName,DepartmentName)");
                strSql.Append(" values (");
                strSql.Append("@USERNAME,@PASSWORD,@EMAIL,@CREATEDATE,@LASTLOGINDATE,@MOBILE,@LASTLOGINIP,@ORGTAG,@RealName,@DepartmentName)");
                SqlParameter[] parameters = {
					new SqlParameter("@USERNAME",SqlDbType.NVarChar),
					new SqlParameter("@PASSWORD",SqlDbType.NVarChar),
					new SqlParameter("@EMAIL",SqlDbType.NVarChar),
					new SqlParameter("@CREATEDATE",SqlDbType.DateTime),
					new SqlParameter("@LASTLOGINDATE",SqlDbType.DateTime),
					new SqlParameter("@MOBILE",SqlDbType.NVarChar),
					new SqlParameter("@LASTLOGINIP",SqlDbType.NVarChar),
                    new SqlParameter("@ORGTAG",SqlDbType.VarChar),
                    new SqlParameter("@RealName",SqlDbType.VarChar),
                    new SqlParameter("@DepartmentName",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.USERNAME;
                parameters[1].Value = entity.PASSWORD;
                parameters[2].Value = entity.EMAIL;
                parameters[3].Value = entity.CREATEDATE;
                parameters[4].Value = entity.LASTLOGINDATE;
                parameters[5].Value = entity.MOBILE;
                parameters[6].Value = entity.LASTLOGINIP;
                parameters[7].Value = entity.ORGTAG;
                parameters[8].Value = entity.RealName;
                parameters[9].Value = entity.DepartmentName;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public int CreateUser(UserAccountsEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into UserAccounts(");
                strSql.Append("USERNAME,PASSWORD,EMAIL,CREATEDATE,LASTLOGINDATE,MOBILE,LASTLOGINIP,ORGTAG)");
                strSql.Append(" values (");
                strSql.Append("@USERNAME,@PASSWORD,@EMAIL,@CREATEDATE,@LASTLOGINDATE,@MOBILE,@LASTLOGINIP,ORGTAG);SELECT @@IDENTITY");
                SqlParameter[] parameters = {
					new SqlParameter("@USERNAME",SqlDbType.NVarChar),
					new SqlParameter("@PASSWORD",SqlDbType.NVarChar),
					new SqlParameter("@EMAIL",SqlDbType.NVarChar),
					new SqlParameter("@CREATEDATE",SqlDbType.DateTime),
					new SqlParameter("@LASTLOGINDATE",SqlDbType.DateTime),
					new SqlParameter("@MOBILE",SqlDbType.NVarChar),
					new SqlParameter("@LASTLOGINIP",SqlDbType.NVarChar),
                    new SqlParameter("@ORGTAG",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.USERNAME;
                parameters[1].Value = entity.PASSWORD;
                parameters[2].Value = entity.EMAIL;
                parameters[3].Value = entity.CREATEDATE;
                parameters[4].Value = entity.LASTLOGINDATE;
                parameters[5].Value = entity.MOBILE;
                parameters[6].Value = entity.LASTLOGINIP;
                parameters[7].Value = entity.ORGTAG;

                return Convert.ToInt32(sqlHelper.GetSingle(strSql.ToString(), parameters));
            }

            public override void Update(UserAccountsEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("update UserAccounts set ");
                strSql.Append("USERNAME=@USERNAME,");
                strSql.Append("PASSWORD=@PASSWORD,");
                strSql.Append("EMAIL=@EMAIL,");
                strSql.Append("CREATEDATE=@CREATEDATE,");
                strSql.Append("LASTLOGINDATE=@LASTLOGINDATE,");
                strSql.Append("MOBILE=@MOBILE,");
                strSql.Append("LASTLOGINIP=@LASTLOGINIP,");
                strSql.Append("ORGTAG=@ORGTAG,");
                strSql.Append("Power=@Power,");
                strSql.Append("RealName=@RealName,");
                strSql.Append("DepartmentName=@DepartmentName");

                strSql.Append(" where USERID=@USERID");
                SqlParameter[] parameters = {
					new SqlParameter("@USERID",SqlDbType.Int),
					new SqlParameter("@USERNAME",SqlDbType.NVarChar),
					new SqlParameter("@PASSWORD",SqlDbType.NVarChar),
					new SqlParameter("@EMAIL",SqlDbType.NVarChar),
					new SqlParameter("@CREATEDATE",SqlDbType.DateTime),
					new SqlParameter("@LASTLOGINDATE",SqlDbType.DateTime),
					new SqlParameter("@MOBILE",SqlDbType.NVarChar),
					new SqlParameter("@LASTLOGINIP",SqlDbType.NVarChar),
                    new SqlParameter("@ORGTAG",SqlDbType.VarChar),
                    new SqlParameter("@Power",SqlDbType.Int),
                    new SqlParameter("@RealName",SqlDbType.VarChar),
                    new SqlParameter("@DepartmentName",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.USERID;
                parameters[1].Value = entity.USERNAME;
                parameters[2].Value = entity.PASSWORD;
                parameters[3].Value = entity.EMAIL;
                parameters[4].Value = entity.CREATEDATE;
                parameters[5].Value = entity.LASTLOGINDATE;
                parameters[6].Value = entity.MOBILE;
                parameters[7].Value = entity.LASTLOGINIP;
                parameters[8].Value = entity.ORGTAG;
                parameters[9].Value = entity.Power;
                parameters[10].Value = entity.RealName;
                parameters[11].Value = entity.DepartmentName;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public bool UpdateSet(int ID, string ColumnName, string Value)
            {
                try
                {
                    StringBuilder StrSql = new StringBuilder();
                    StrSql.Append("update UserAccounts set ");
                    StrSql.Append(ColumnName + "='" + Value + "'");
                    StrSql.Append(" where USERID=" + ID);
                    sqlHelper.ExecuteSql(StrSql.ToString(), null);
                    return true;
                }
                catch
                {
                    return false;
                }
            }

            public bool Delete(int ID)
            {
                string strSql = "delete from UserAccounts where USERID=" + ID;
                try
                {
                    sqlHelper.ExecuteSql(strSql, null);
                    return true;
                }
                catch
                {
                    return false;
                }
            }

            public bool Delete(string ID)
            {
                string strSql = "delete from UserAccounts where USERID in (" + ID + ")";
                try
                {
                    sqlHelper.ExecuteSql(strSql, null);
                    return true;
                }
                catch
                {
                    return false;
                }
            }

            public override void Delete(UserAccountsEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from UserAccounts ");
                strSql.Append(" where USERID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.USERID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override UserAccountsEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from UserAccounts ");
                strSql.Append(" where USERID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    UserAccountsEntity entity = new UserAccountsEntity();
                    if (!Convert.IsDBNull(row["USERID"]))
                    {
                        entity.USERID = (int)row["USERID"];
                    }
                    entity.USERNAME = row["USERNAME"].ToString();
                    entity.PASSWORD = row["PASSWORD"].ToString();
                    entity.EMAIL = row["EMAIL"].ToString();
                    if (!Convert.IsDBNull(row["CREATEDATE"]))
                    {
                        entity.CREATEDATE = (DateTime)row["CREATEDATE"];
                    }
                    if (!Convert.IsDBNull(row["LASTLOGINDATE"]))
                    {
                        entity.LASTLOGINDATE = (DateTime)row["LASTLOGINDATE"];
                    }
                    entity.MOBILE = row["MOBILE"].ToString();
                    entity.LASTLOGINIP = row["LASTLOGINIP"].ToString();
                    entity.ORGTAG = row["ORGTAG"].ToString();
                    entity.Power = Convert.ToInt32(row["Power"].ToString());
                    entity.RealName = row["RealName"].ToString();
                    entity.DepartmentName = row["DepartmentName"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public List<UserAccountsEntity> GetUser(string userName, string passWord, string serverName)
            {
                string strWhere = " USERNAME=@USERNAME AND PASSWORD=@PASSWORD AND ORGTAG=@ORGTAG";
                SqlParameter[] parameters = {
						new SqlParameter("@USERNAME", SqlDbType.NVarChar),
                        new SqlParameter("@PASSWORD", SqlDbType.NVarChar),
                        new SqlParameter("@ORGTAG",SqlDbType.VarChar)
                                            };
                parameters[0].Value = userName;
                parameters[1].Value = passWord;
                parameters[2].Value = serverName;
                return Find(strWhere, parameters);
            }

            public override List<UserAccountsEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM UserAccounts(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<UserAccountsEntity> list = new List<UserAccountsEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        UserAccountsEntity entity = new UserAccountsEntity();
                        if (!Convert.IsDBNull(row["USERID"]))
                        {
                            entity.USERID = (int)row["USERID"];
                        }
                        entity.USERNAME = row["USERNAME"].ToString();
                        entity.PASSWORD = row["PASSWORD"].ToString();
                        entity.EMAIL = row["EMAIL"].ToString();
                        if (!Convert.IsDBNull(row["CREATEDATE"]))
                        {
                            entity.CREATEDATE = (DateTime)row["CREATEDATE"];
                        }
                        if (!Convert.IsDBNull(row["LASTLOGINDATE"]))
                        {
                            entity.LASTLOGINDATE = (DateTime)row["LASTLOGINDATE"];
                        }
                        entity.MOBILE = row["MOBILE"].ToString();
                        entity.LASTLOGINIP = row["LASTLOGINIP"].ToString();
                        entity.ORGTAG = row["ORGTAG"].ToString();
                        entity.Power = Convert.ToInt32(row["Power"].ToString());
                        entity.RealName = row["RealName"].ToString();
                        entity.DepartmentName = row["DepartmentName"].ToString();
                        if (!Convert.IsDBNull(row["DefaultPath"]))
                        {
                            entity.DefaultPath = row["DefaultPath"].ToString();
                        }
                        else
                        {
                            entity.DefaultPath = "";
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

            public IList<UserAccountsEntity> GetUserAccountsList(string idlist, bool tag)
            {
                string strWhere = string.Empty;
                if (tag)
                {
                    if (!string.IsNullOrEmpty(idlist))
                    {
                        strWhere = "USERID IN (" + idlist + ")";
                    }
                    else
                    {
                        strWhere = "USERID < 0";
                    }
                }
                else
                {
                    if (!string.IsNullOrEmpty(idlist))
                    {
                        strWhere = "USERID NOT IN (" + idlist + ")";
                    }
                    else
                    {
                        strWhere = "";
                    }
                }
                return Find(strWhere, null);
            }

            public override DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM UserAccounts(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }

            public DataTable GetUserInnerRoleDataTable(string strSql)
            {
                DataSet ds = sqlHelper.ExecuteDateSet(strSql, null);
                DataTable dt = new DataTable();
                if (ds != null)
                {
                    dt = ds.Tables[0];
                }
                return dt;
            }

            public DataTable GetCityTag(int userid)
            {
                try
                {
                    string sql = "SELECT * FROM dbo.UserAccounts WHERE USERID=@UserID";
                    SqlParameter[] param = { 
                                       new SqlParameter("@UserID",userid)
                                       };
                    return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
                }
                catch (Exception )
                {
                    
                    throw;
                }
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from UserAccounts ";
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
                int endNumber = startNumber + pageSize + 1;
                string sql = string.Format("SELECT TOP {0} * FROM (SELECT ROW_NUMBER() OVER", pageSize);

                if (!string.IsNullOrEmpty(orderBy))
                {
                    sql += string.Format(" (ORDER BY {0})", orderBy);
                }
                else
                {

                    sql += " (ORDER BY USERID)";//默认按主键排序

                }

                sql += " AS RowNumber,* FROM UserAccounts";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString() + " AND RowNumber<" + endNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            public DataTable GetPager2(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
            {
                int startNumber = pageSize * (pageNumber - 1);
                int endNumber = startNumber + pageSize + 1;
                string sql = string.Format("SELECT TOP {0} * FROM (SELECT ROW_NUMBER() OVER", pageSize);

                if (!string.IsNullOrEmpty(orderBy))
                {
                    sql += string.Format(" (ORDER BY {0})", orderBy);
                }
                else
                {
                    sql += " (ORDER BY ua.USERID)";//默认按主键排序
                }

                sql += " AS RowNumber,ua.USERID,USERNAME,PASSWORD,EMAIL,CREATEDATE,LASTLOGINDATE,MOBILE,LASTLOGINIP,OrgTag,Power,RealName,DepartmentName,RoleID,r.RoleName FROM UserAccounts AS ua INNER JOIN dbo.UserRole ur ON ua.USERID = ur.UserID INNER JOIN dbo.Role AS r ON ur.RoleID=r.ID  ";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString() + " AND RowNumber<" + endNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            #endregion

        }
    }
}
