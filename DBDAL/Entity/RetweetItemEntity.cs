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
    public partial class RetweetItemEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "RetweetItem";
        public const string PrimaryKey = "PK_RetweetItem_1";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string Text = "Text";
            public const string Count = "Count";
            public const string Mcount = "Mcount";
            public const string Name = "Name";
            public const string UserID = "UserID";
            public const string Timestamp = "Timestamp";
            public const string WebType = "WebType";
            public const string WebSource = "WebSource";
            public const string InsertTime = "InsertTime";
            public const string Thumbnail_pic = "Thumbnail_pic";
            public const string Original_pic = "Original_pic";
        }
        #endregion

        #region constructors
        public RetweetItemEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public RetweetItemEntity(long id, string text, int count, int mcount, string name, string userid, DateTime timestamp, int webtype, int websource, DateTime inserttime, string thumbnail_pic, string original_pic)
        {
            this.ID = id;

            this.Text = text;

            this.Count = count;

            this.Mcount = mcount;

            this.Name = name;

            this.UserID = userid;

            this.Timestamp = timestamp;

            this.WebType = webtype;

            this.WebSource = websource;

            this.InsertTime = inserttime;

            this.Thumbnail_pic = thumbnail_pic;

            this.Original_pic = original_pic;

        }
        #endregion

        #region Properties

        public long? ID
        {
            get;
            set;
        }


        public string Text
        {
            get;
            set;
        }


        public int? Count
        {
            get;
            set;
        }


        public int? Mcount
        {
            get;
            set;
        }


        public string Name
        {
            get;
            set;
        }


        public string UserID
        {
            get;
            set;
        }


        public DateTime? Timestamp
        {
            get;
            set;
        }


        public int? WebType
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


        public string Thumbnail_pic
        {
            get;
            set;
        }


        public string Original_pic
        {
            get;
            set;
        }

        #endregion

        public class RetweetItemDAO : SqlDAO<RetweetItemEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public RetweetItemDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(RetweetItemEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into RetweetItem(");
                strSql.Append("ID,Text,Count,Mcount,Name,UserID,Timestamp,WebType,WebSource,InsertTime,Thumbnail_pic,Original_pic)");
                strSql.Append(" values (");
                strSql.Append("@ID,@Text,@Count,@Mcount,@Name,@UserID,@Timestamp,@WebType,@WebSource,@InsertTime,@Thumbnail_pic,@Original_pic)");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.BigInt),
					new SqlParameter("@Text",SqlDbType.VarChar),
					new SqlParameter("@Count",SqlDbType.Int),
					new SqlParameter("@Mcount",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@UserID",SqlDbType.VarChar),
					new SqlParameter("@Timestamp",SqlDbType.DateTime),
					new SqlParameter("@WebType",SqlDbType.Int),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@Thumbnail_pic",SqlDbType.VarChar),
					new SqlParameter("@Original_pic",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.Text;
                parameters[2].Value = entity.Count;
                parameters[3].Value = entity.Mcount;
                parameters[4].Value = entity.Name;
                parameters[5].Value = entity.UserID;
                parameters[6].Value = entity.Timestamp;
                parameters[7].Value = entity.WebType;
                parameters[8].Value = entity.WebSource;
                parameters[9].Value = entity.InsertTime;
                parameters[10].Value = entity.Thumbnail_pic;
                parameters[11].Value = entity.Original_pic;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(RetweetItemEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update RetweetItem set ");
                strSql.Append("Text=@Text,");
                strSql.Append("Count=@Count,");
                strSql.Append("Mcount=@Mcount,");
                strSql.Append("Name=@Name,");
                strSql.Append("UserID=@UserID,");
                strSql.Append("Timestamp=@Timestamp,");
                strSql.Append("WebType=@WebType,");
                strSql.Append("InsertTime=@InsertTime,");
                strSql.Append("Thumbnail_pic=@Thumbnail_pic,");
                strSql.Append("Original_pic=@Original_pic");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.BigInt),
					new SqlParameter("@Text",SqlDbType.VarChar),
					new SqlParameter("@Count",SqlDbType.Int),
					new SqlParameter("@Mcount",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@UserID",SqlDbType.VarChar),
					new SqlParameter("@Timestamp",SqlDbType.DateTime),
					new SqlParameter("@WebType",SqlDbType.Int),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@Thumbnail_pic",SqlDbType.VarChar),
					new SqlParameter("@Original_pic",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.Text;
                parameters[2].Value = entity.Count;
                parameters[3].Value = entity.Mcount;
                parameters[4].Value = entity.Name;
                parameters[5].Value = entity.UserID;
                parameters[6].Value = entity.Timestamp;
                parameters[7].Value = entity.WebType;
                parameters[8].Value = entity.WebSource;
                parameters[9].Value = entity.InsertTime;
                parameters[10].Value = entity.Thumbnail_pic;
                parameters[11].Value = entity.Original_pic;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(RetweetItemEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from RetweetItem ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override RetweetItemEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from RetweetItem ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    RetweetItemEntity entity = new RetweetItemEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (long)row["ID"];
                    }
                    entity.Text = row["Text"].ToString();
                    if (!Convert.IsDBNull(row["Count"]))
                    {
                        entity.Count = (int)row["Count"];
                    }
                    if (!Convert.IsDBNull(row["Mcount"]))
                    {
                        entity.Mcount = (int)row["Mcount"];
                    }
                    entity.Name = row["Name"].ToString();
                    entity.UserID = row["UserID"].ToString();
                    if (!Convert.IsDBNull(row["Timestamp"]))
                    {
                        entity.Timestamp = (DateTime)row["Timestamp"];
                    }
                    if (!Convert.IsDBNull(row["WebType"]))
                    {
                        entity.WebType = (int)row["WebType"];
                    }
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    if (!Convert.IsDBNull(row["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)row["InsertTime"];
                    }
                    entity.Thumbnail_pic = row["Thumbnail_pic"].ToString();
                    entity.Original_pic = row["Original_pic"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<RetweetItemEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM RetweetItem(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<RetweetItemEntity> list = new List<RetweetItemEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        RetweetItemEntity entity = new RetweetItemEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (long)row["ID"];
                        }
                        entity.Text = row["Text"].ToString();
                        if (!Convert.IsDBNull(row["Count"]))
                        {
                            entity.Count = (int)row["Count"];
                        }
                        if (!Convert.IsDBNull(row["Mcount"]))
                        {
                            entity.Mcount = (int)row["Mcount"];
                        }
                        entity.Name = row["Name"].ToString();
                        entity.UserID = row["UserID"].ToString();
                        if (!Convert.IsDBNull(row["Timestamp"]))
                        {
                            entity.Timestamp = (DateTime)row["Timestamp"];
                        }
                        if (!Convert.IsDBNull(row["WebType"]))
                        {
                            entity.WebType = (int)row["WebType"];
                        }
                        if (!Convert.IsDBNull(row["WebSource"]))
                        {
                            entity.WebSource = (int)row["WebSource"];
                        }
                        if (!Convert.IsDBNull(row["InsertTime"]))
                        {
                            entity.InsertTime = (DateTime)row["InsertTime"];
                        }
                        entity.Thumbnail_pic = row["Thumbnail_pic"].ToString();
                        entity.Original_pic = row["Original_pic"].ToString();

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
                strSql.Append(" FROM RetweetItem(nolock)");
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
                string sql = "select count(*) from RetweetItem ";
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

                sql += " AS RowNumber,* FROM RetweetItem";

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

