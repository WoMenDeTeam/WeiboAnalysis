using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Entity;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class CaseEventEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "CaseEvent";
        public const string PrimaryKey = "PK_CaseEvent";
        #endregion

        #region columns
        public struct Columns
        {
            public const string EventID = "EventID";
            public const string EventName = "EventName";
            public const string EventKeywords = "EventKeywords";
            public const string EventCategoryID = "EventCategoryID";
            public const string EventAccidentTypeID = "EventAccidentTypeID";
            public const string OccurrenceTime = "OccurrenceTime";
            public const string EventHolidayName = "EventHolidayName";
            public const string HolidayBeginTime = "HolidayBeginTime";
            public const string HolidayEndTime = "HolidayEndTime";
            public const string PoliticsFactorName = "PoliticsFactorName";
            public const string FactorBeginTime = "FactorBeginTime";
            public const string FactorEndTime = "FactorEndTime";
            public const string OccurrenceProvinceID = "OccurrenceProvinceID";
            public const string OccurrenceCityID = "OccurrenceCityID";
            public const string OccurrenceArea = "OccurrenceArea";
            public const string OccurrenceTown = "OccurrenceTown";
            public const string OccurrenceVillage = "OccurrenceVillage";
            public const string OccurrenceHamlet = "OccurrenceHamlet";
            public const string OccurrenceKeyword = "OccurrenceKeyword";
            public const string SubjectionUnit = "SubjectionUnit";
            public const string EventUnit = "EventUnit";
            public const string DeadCount = "DeadCount";
            public const string InjuryCount = "InjuryCount";
            public const string LostCount = "LostCount";
            public const string LostPropertyCount = "LostPropertyCount";
            public const string LostBelongings = "LostBelongings";
            public const string EventDescription = "EventDescription";
            public const string FirstMedia = "FirstMedia";
            public const string FirstWeibo = "FirstWeibo";
            public const string FirstWeiboUser = "FirstWeiboUser";
            public const string FirstWeiboDate = "FirstWeiboDate";
            public const string FirstWeiboLink = "FirstWeiboLink";
            public const string FirstWeiboContent = "FirstWeiboContent";
            public const string CreateDate = "CreateDate";
        }
        #endregion

        #region constructors
        public CaseEventEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public CaseEventEntity(int eventid, string eventname, string eventkeywords, string eventcategoryid, string eventaccidenttypeid, DateTime occurrencetime, string eventholidayname, DateTime holidaybegintime, DateTime holidayendtime, string politicsfactorname, DateTime factorbegintime, DateTime factorendtime, int occurrenceprovinceid, int occurrencecityid, string occurrencearea, string occurrencetown, string occurrencevillage, string occurrencehamlet, string occurrencekeyword, string subjectionunit, string eventunit, int deadcount, int injurycount, int lostcount, int lostpropertycount, string lostbelongings, string eventdescription, string firstmedia, string firstweibo, string firstweibouser, DateTime firstweibodate, string firstweibolink, string firstweibocontent, DateTime createdate)
        {
            this.EventID = eventid;

            this.EventName = eventname;

            this.EventKeywords = eventkeywords;

            this.EventCategoryID = eventcategoryid;

            this.EventAccidentTypeID = eventaccidenttypeid;

            this.OccurrenceTime = occurrencetime;

            this.EventHolidayName = eventholidayname;

            this.HolidayBeginTime = holidaybegintime;

            this.HolidayEndTime = holidayendtime;

            this.PoliticsFactorName = politicsfactorname;

            this.FactorBeginTime = factorbegintime;

            this.FactorEndTime = factorendtime;

            this.OccurrenceProvinceID = occurrenceprovinceid;

            this.OccurrenceCityID = occurrencecityid;

            this.OccurrenceArea = occurrencearea;

            this.OccurrenceTown = occurrencetown;

            this.OccurrenceVillage = occurrencevillage;

            this.OccurrenceHamlet = occurrencehamlet;

            this.OccurrenceKeyword = occurrencekeyword;

            this.SubjectionUnit = subjectionunit;

            this.EventUnit = eventunit;

            this.DeadCount = deadcount;

            this.InjuryCount = injurycount;

            this.LostCount = lostcount;

            this.LostPropertyCount = lostpropertycount;

            this.LostBelongings = lostbelongings;

            this.EventDescription = eventdescription;

            this.FirstMedia = firstmedia;

            this.FirstWeibo = firstweibo;

            this.FirstWeiboUser = firstweibouser;

            this.FirstWeiboDate = firstweibodate;

            this.FirstWeiboLink = firstweibolink;

            this.FirstWeiboContent = firstweibocontent;

            this.CreateDate = createdate;

        }
        #endregion

        #region Properties

        public int? EventID
        {
            get;
            set;
        }


        public string EventName
        {
            get;
            set;
        }


        public string EventKeywords
        {
            get;
            set;
        }


        public string EventCategoryID
        {
            get;
            set;
        }


        public string EventAccidentTypeID
        {
            get;
            set;
        }


        public DateTime? OccurrenceTime
        {
            get;
            set;
        }


        public string EventHolidayName
        {
            get;
            set;
        }


        public DateTime? HolidayBeginTime
        {
            get;
            set;
        }


        public DateTime? HolidayEndTime
        {
            get;
            set;
        }


        public string PoliticsFactorName
        {
            get;
            set;
        }


        public DateTime? FactorBeginTime
        {
            get;
            set;
        }


        public DateTime? FactorEndTime
        {
            get;
            set;
        }


        public int? OccurrenceProvinceID
        {
            get;
            set;
        }


        public int? OccurrenceCityID
        {
            get;
            set;
        }


        public string OccurrenceArea
        {
            get;
            set;
        }


        public string OccurrenceTown
        {
            get;
            set;
        }


        public string OccurrenceVillage
        {
            get;
            set;
        }


        public string OccurrenceHamlet
        {
            get;
            set;
        }


        public string OccurrenceKeyword
        {
            get;
            set;
        }


        public string SubjectionUnit
        {
            get;
            set;
        }


        public string EventUnit
        {
            get;
            set;
        }


        public int? DeadCount
        {
            get;
            set;
        }


        public int? InjuryCount
        {
            get;
            set;
        }


        public int? LostCount
        {
            get;
            set;
        }


        public int? LostPropertyCount
        {
            get;
            set;
        }


        public string LostBelongings
        {
            get;
            set;
        }


        public string EventDescription
        {
            get;
            set;
        }


        public string FirstMedia
        {
            get;
            set;
        }


        public string FirstWeibo
        {
            get;
            set;
        }


        public string FirstWeiboUser
        {
            get;
            set;
        }


        public DateTime? FirstWeiboDate
        {
            get;
            set;
        }


        public string FirstWeiboLink
        {
            get;
            set;
        }


        public string FirstWeiboContent
        {
            get;
            set;
        }


        public DateTime? CreateDate
        {
            get;
            set;
        }

        #endregion

        public class CaseEventDAO : SqlDAO<CaseEventEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public CaseEventDAO()
            {
                //string strkey = Util.ConfigUtil.CacheUsreInfo.SqlDBKey();
                //if (string.IsNullOrEmpty(strkey))
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(CaseEventEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into CaseEvent(");
                strSql.Append("EventName,EventKeywords,EventCategoryID,EventAccidentTypeID,OccurrenceTime,EventHolidayName,HolidayBeginTime,HolidayEndTime,PoliticsFactorName,FactorBeginTime,FactorEndTime,OccurrenceProvinceID,OccurrenceCityID,OccurrenceArea,OccurrenceTown,OccurrenceVillage,OccurrenceHamlet,OccurrenceKeyword,SubjectionUnit,EventUnit,DeadCount,InjuryCount,LostCount,LostPropertyCount,LostBelongings,EventDescription,FirstMedia,FirstWeibo,FirstWeiboUser,FirstWeiboDate,FirstWeiboLink,FirstWeiboContent,CreateDate)");
                strSql.Append(" values (");
                strSql.Append("@EventName,@EventKeywords,@EventCategoryID,@EventAccidentTypeID,@OccurrenceTime,@EventHolidayName,@HolidayBeginTime,@HolidayEndTime,@PoliticsFactorName,@FactorBeginTime,@FactorEndTime,@OccurrenceProvinceID,@OccurrenceCityID,@OccurrenceArea,@OccurrenceTown,@OccurrenceVillage,@OccurrenceHamlet,@OccurrenceKeyword,@SubjectionUnit,@EventUnit,@DeadCount,@InjuryCount,@LostCount,@LostPropertyCount,@LostBelongings,@EventDescription,@FirstMedia,@FirstWeibo,@FirstWeiboUser,@FirstWeiboDate,@FirstWeiboLink,@FirstWeiboContent,@CreateDate)");
                SqlParameter[] parameters = {
					new SqlParameter("@EventName",SqlDbType.NVarChar),
					new SqlParameter("@EventKeywords",SqlDbType.NVarChar),
					new SqlParameter("@EventCategoryID",SqlDbType.VarChar),
					new SqlParameter("@EventAccidentTypeID",SqlDbType.VarChar),
					new SqlParameter("@OccurrenceTime",SqlDbType.DateTime),
					new SqlParameter("@EventHolidayName",SqlDbType.NVarChar),
					new SqlParameter("@HolidayBeginTime",SqlDbType.DateTime),
					new SqlParameter("@HolidayEndTime",SqlDbType.DateTime),
					new SqlParameter("@PoliticsFactorName",SqlDbType.NVarChar),
					new SqlParameter("@FactorBeginTime",SqlDbType.DateTime),
					new SqlParameter("@FactorEndTime",SqlDbType.DateTime),
					new SqlParameter("@OccurrenceProvinceID",SqlDbType.Int),
					new SqlParameter("@OccurrenceCityID",SqlDbType.Int),
					new SqlParameter("@OccurrenceArea",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceTown",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceVillage",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceHamlet",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceKeyword",SqlDbType.NVarChar),
					new SqlParameter("@SubjectionUnit",SqlDbType.NVarChar),
					new SqlParameter("@EventUnit",SqlDbType.NVarChar),
					new SqlParameter("@DeadCount",SqlDbType.Int),
					new SqlParameter("@InjuryCount",SqlDbType.Int),
					new SqlParameter("@LostCount",SqlDbType.Int),
					new SqlParameter("@LostPropertyCount",SqlDbType.Int),
					new SqlParameter("@LostBelongings",SqlDbType.VarChar),
					new SqlParameter("@EventDescription",SqlDbType.NVarChar),
					new SqlParameter("@FirstMedia",SqlDbType.NVarChar),
					new SqlParameter("@FirstWeibo",SqlDbType.NVarChar),
					new SqlParameter("@FirstWeiboUser",SqlDbType.VarChar),
					new SqlParameter("@FirstWeiboDate",SqlDbType.DateTime),
					new SqlParameter("@FirstWeiboLink",SqlDbType.VarChar),
					new SqlParameter("@FirstWeiboContent",SqlDbType.VarChar),
					new SqlParameter("@CreateDate",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.EventName;
                parameters[1].Value = entity.EventKeywords;
                parameters[2].Value = entity.EventCategoryID;
                parameters[3].Value = entity.EventAccidentTypeID;
                parameters[4].Value = entity.OccurrenceTime;
                parameters[5].Value = entity.EventHolidayName;
                parameters[6].Value = entity.HolidayBeginTime;
                parameters[7].Value = entity.HolidayEndTime;
                parameters[8].Value = entity.PoliticsFactorName;
                parameters[9].Value = entity.FactorBeginTime;
                parameters[10].Value = entity.FactorEndTime;
                parameters[11].Value = entity.OccurrenceProvinceID;
                parameters[12].Value = entity.OccurrenceCityID;
                parameters[13].Value = entity.OccurrenceArea;
                parameters[14].Value = entity.OccurrenceTown;
                parameters[15].Value = entity.OccurrenceVillage;
                parameters[16].Value = entity.OccurrenceHamlet;
                parameters[17].Value = entity.OccurrenceKeyword;
                parameters[18].Value = entity.SubjectionUnit;
                parameters[19].Value = entity.EventUnit;
                parameters[20].Value = entity.DeadCount;
                parameters[21].Value = entity.InjuryCount;
                parameters[22].Value = entity.LostCount;
                parameters[23].Value = entity.LostPropertyCount;
                parameters[24].Value = entity.LostBelongings;
                parameters[25].Value = entity.EventDescription;
                parameters[26].Value = entity.FirstMedia;
                parameters[27].Value = entity.FirstWeibo;
                parameters[28].Value = entity.FirstWeiboUser;
                parameters[29].Value = entity.FirstWeiboDate;
                parameters[30].Value = entity.FirstWeiboLink;
                parameters[31].Value = entity.FirstWeiboContent;
                parameters[32].Value = entity.CreateDate;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(CaseEventEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update CaseEvent set ");
                strSql.Append("EventName=@EventName,");
                strSql.Append("EventKeywords=@EventKeywords,");
                strSql.Append("EventCategoryID=@EventCategoryID,");
                strSql.Append("EventAccidentTypeID=@EventAccidentTypeID,");
                strSql.Append("OccurrenceTime=@OccurrenceTime,");
                strSql.Append("EventHolidayName=@EventHolidayName,");
                strSql.Append("HolidayBeginTime=@HolidayBeginTime,");
                strSql.Append("HolidayEndTime=@HolidayEndTime,");
                strSql.Append("PoliticsFactorName=@PoliticsFactorName,");
                strSql.Append("FactorBeginTime=@FactorBeginTime,");
                strSql.Append("FactorEndTime=@FactorEndTime,");
                strSql.Append("OccurrenceProvinceID=@OccurrenceProvinceID,");
                strSql.Append("OccurrenceCityID=@OccurrenceCityID,");
                strSql.Append("OccurrenceArea=@OccurrenceArea,");
                strSql.Append("OccurrenceTown=@OccurrenceTown,");
                strSql.Append("OccurrenceVillage=@OccurrenceVillage,");
                strSql.Append("OccurrenceHamlet=@OccurrenceHamlet,");
                strSql.Append("OccurrenceKeyword=@OccurrenceKeyword,");
                strSql.Append("SubjectionUnit=@SubjectionUnit,");
                strSql.Append("EventUnit=@EventUnit,");
                strSql.Append("DeadCount=@DeadCount,");
                strSql.Append("InjuryCount=@InjuryCount,");
                strSql.Append("LostCount=@LostCount,");
                strSql.Append("LostPropertyCount=@LostPropertyCount,");
                strSql.Append("LostBelongings=@LostBelongings,");
                strSql.Append("EventDescription=@EventDescription,");
                strSql.Append("FirstMedia=@FirstMedia,");
                strSql.Append("FirstWeibo=@FirstWeibo,");
                strSql.Append("FirstWeiboUser=@FirstWeiboUser,");
                strSql.Append("FirstWeiboDate=@FirstWeiboDate,");
                strSql.Append("FirstWeiboLink=@FirstWeiboLink,");
                strSql.Append("FirstWeiboContent=@FirstWeiboContent,");
                strSql.Append("CreateDate=@CreateDate");

                strSql.Append(" where EventID=@EventID");
                SqlParameter[] parameters = {
					new SqlParameter("@EventID",SqlDbType.Int),
					new SqlParameter("@EventName",SqlDbType.NVarChar),
					new SqlParameter("@EventKeywords",SqlDbType.NVarChar),
					new SqlParameter("@EventCategoryID",SqlDbType.VarChar),
					new SqlParameter("@EventAccidentTypeID",SqlDbType.VarChar),
					new SqlParameter("@OccurrenceTime",SqlDbType.DateTime),
					new SqlParameter("@EventHolidayName",SqlDbType.NVarChar),
					new SqlParameter("@HolidayBeginTime",SqlDbType.DateTime),
					new SqlParameter("@HolidayEndTime",SqlDbType.DateTime),
					new SqlParameter("@PoliticsFactorName",SqlDbType.NVarChar),
					new SqlParameter("@FactorBeginTime",SqlDbType.DateTime),
					new SqlParameter("@FactorEndTime",SqlDbType.DateTime),
					new SqlParameter("@OccurrenceProvinceID",SqlDbType.Int),
					new SqlParameter("@OccurrenceCityID",SqlDbType.Int),
					new SqlParameter("@OccurrenceArea",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceTown",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceVillage",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceHamlet",SqlDbType.NVarChar),
					new SqlParameter("@OccurrenceKeyword",SqlDbType.NVarChar),
					new SqlParameter("@SubjectionUnit",SqlDbType.NVarChar),
					new SqlParameter("@EventUnit",SqlDbType.NVarChar),
					new SqlParameter("@DeadCount",SqlDbType.Int),
					new SqlParameter("@InjuryCount",SqlDbType.Int),
					new SqlParameter("@LostCount",SqlDbType.Int),
					new SqlParameter("@LostPropertyCount",SqlDbType.Int),
					new SqlParameter("@LostBelongings",SqlDbType.VarChar),
					new SqlParameter("@EventDescription",SqlDbType.NVarChar),
					new SqlParameter("@FirstMedia",SqlDbType.NVarChar),
					new SqlParameter("@FirstWeibo",SqlDbType.NVarChar),
					new SqlParameter("@FirstWeiboUser",SqlDbType.VarChar),
					new SqlParameter("@FirstWeiboDate",SqlDbType.DateTime),
					new SqlParameter("@FirstWeiboLink",SqlDbType.VarChar),
					new SqlParameter("@FirstWeiboContent",SqlDbType.VarChar),
					new SqlParameter("@CreateDate",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.EventID;
                parameters[1].Value = entity.EventName;
                parameters[2].Value = entity.EventKeywords;
                parameters[3].Value = entity.EventCategoryID;
                parameters[4].Value = entity.EventAccidentTypeID;
                parameters[5].Value = entity.OccurrenceTime;
                parameters[6].Value = entity.EventHolidayName;
                parameters[7].Value = entity.HolidayBeginTime;
                parameters[8].Value = entity.HolidayEndTime;
                parameters[9].Value = entity.PoliticsFactorName;
                parameters[10].Value = entity.FactorBeginTime;
                parameters[11].Value = entity.FactorEndTime;
                parameters[12].Value = entity.OccurrenceProvinceID;
                parameters[13].Value = entity.OccurrenceCityID;
                parameters[14].Value = entity.OccurrenceArea;
                parameters[15].Value = entity.OccurrenceTown;
                parameters[16].Value = entity.OccurrenceVillage;
                parameters[17].Value = entity.OccurrenceHamlet;
                parameters[18].Value = entity.OccurrenceKeyword;
                parameters[19].Value = entity.SubjectionUnit;
                parameters[20].Value = entity.EventUnit;
                parameters[21].Value = entity.DeadCount;
                parameters[22].Value = entity.InjuryCount;
                parameters[23].Value = entity.LostCount;
                parameters[24].Value = entity.LostPropertyCount;
                parameters[25].Value = entity.LostBelongings;
                parameters[26].Value = entity.EventDescription;
                parameters[27].Value = entity.FirstMedia;
                parameters[28].Value = entity.FirstWeibo;
                parameters[29].Value = entity.FirstWeiboUser;
                parameters[30].Value = entity.FirstWeiboDate;
                parameters[31].Value = entity.FirstWeiboLink;
                parameters[32].Value = entity.FirstWeiboContent;
                parameters[33].Value = entity.CreateDate;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(CaseEventEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from CaseEvent ");
                strSql.Append(" where EventID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.EventID;//.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override CaseEventEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from CaseEvent ");
                strSql.Append(" where EventID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    CaseEventEntity entity = new CaseEventEntity();
                    if (!Convert.IsDBNull(row["EventID"]))
                    {
                        entity.EventID = (int)row["EventID"];
                    }
                    entity.EventName = row["EventName"].ToString();
                    entity.EventKeywords = row["EventKeywords"].ToString();
                    entity.EventCategoryID = row["EventCategoryID"].ToString();
                    entity.EventAccidentTypeID = row["EventAccidentTypeID"].ToString();
                    if (!Convert.IsDBNull(row["OccurrenceTime"]))
                    {
                        entity.OccurrenceTime = (DateTime)row["OccurrenceTime"];
                    }
                    entity.EventHolidayName = row["EventHolidayName"].ToString();
                    if (!Convert.IsDBNull(row["HolidayBeginTime"]))
                    {
                        entity.HolidayBeginTime = (DateTime)row["HolidayBeginTime"];
                    }
                    if (!Convert.IsDBNull(row["HolidayEndTime"]))
                    {
                        entity.HolidayEndTime = (DateTime)row["HolidayEndTime"];
                    }
                    entity.PoliticsFactorName = row["PoliticsFactorName"].ToString();
                    if (!Convert.IsDBNull(row["FactorBeginTime"]))
                    {
                        entity.FactorBeginTime = (DateTime)row["FactorBeginTime"];
                    }
                    if (!Convert.IsDBNull(row["FactorEndTime"]))
                    {
                        entity.FactorEndTime = (DateTime)row["FactorEndTime"];
                    }
                    if (!Convert.IsDBNull(row["OccurrenceProvinceID"]))
                    {
                        entity.OccurrenceProvinceID = (int)row["OccurrenceProvinceID"];
                    }
                    if (!Convert.IsDBNull(row["OccurrenceCityID"]))
                    {
                        entity.OccurrenceCityID = (int)row["OccurrenceCityID"];
                    }
                    entity.OccurrenceArea = row["OccurrenceArea"].ToString();
                    entity.OccurrenceTown = row["OccurrenceTown"].ToString();
                    entity.OccurrenceVillage = row["OccurrenceVillage"].ToString();
                    entity.OccurrenceHamlet = row["OccurrenceHamlet"].ToString();
                    entity.OccurrenceKeyword = row["OccurrenceKeyword"].ToString();
                    entity.SubjectionUnit = row["SubjectionUnit"].ToString();
                    entity.EventUnit = row["EventUnit"].ToString();
                    if (!Convert.IsDBNull(row["DeadCount"]))
                    {
                        entity.DeadCount = (int)row["DeadCount"];
                    }
                    if (!Convert.IsDBNull(row["InjuryCount"]))
                    {
                        entity.InjuryCount = (int)row["InjuryCount"];
                    }
                    if (!Convert.IsDBNull(row["LostCount"]))
                    {
                        entity.LostCount = (int)row["LostCount"];
                    }
                    if (!Convert.IsDBNull(row["LostPropertyCount"]))
                    {
                        entity.LostPropertyCount = (int)row["LostPropertyCount"];
                    }
                    entity.LostBelongings = row["LostBelongings"].ToString();
                    entity.EventDescription = row["EventDescription"].ToString();
                    entity.FirstMedia = row["FirstMedia"].ToString();
                    entity.FirstWeibo = row["FirstWeibo"].ToString();
                    entity.FirstWeiboUser = row["FirstWeiboUser"].ToString();
                    if (!Convert.IsDBNull(row["FirstWeiboDate"]))
                    {
                        entity.FirstWeiboDate = (DateTime)row["FirstWeiboDate"];
                    }
                    entity.FirstWeiboLink = row["FirstWeiboLink"].ToString();
                    entity.FirstWeiboContent = row["FirstWeiboContent"].ToString();
                    if (!Convert.IsDBNull(row["CreateDate"]))
                    {
                        entity.CreateDate = (DateTime)row["CreateDate"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<CaseEventEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM CaseEvent(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<CaseEventEntity> list = new List<CaseEventEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CaseEventEntity entity = new CaseEventEntity();
                        if (!Convert.IsDBNull(row["EventID"]))
                        {
                            entity.EventID = (int)row["EventID"];
                        }
                        entity.EventName = row["EventName"].ToString();
                        entity.EventKeywords = row["EventKeywords"].ToString();
                        entity.EventCategoryID = row["EventCategoryID"].ToString();
                        entity.EventAccidentTypeID = row["EventAccidentTypeID"].ToString();
                        if (!Convert.IsDBNull(row["OccurrenceTime"]))
                        {
                            entity.OccurrenceTime = (DateTime)row["OccurrenceTime"];
                        }
                        entity.EventHolidayName = row["EventHolidayName"].ToString();
                        if (!Convert.IsDBNull(row["HolidayBeginTime"]))
                        {
                            entity.HolidayBeginTime = (DateTime)row["HolidayBeginTime"];
                        }
                        if (!Convert.IsDBNull(row["HolidayEndTime"]))
                        {
                            entity.HolidayEndTime = (DateTime)row["HolidayEndTime"];
                        }
                        entity.PoliticsFactorName = row["PoliticsFactorName"].ToString();
                        if (!Convert.IsDBNull(row["FactorBeginTime"]))
                        {
                            entity.FactorBeginTime = (DateTime)row["FactorBeginTime"];
                        }
                        if (!Convert.IsDBNull(row["FactorEndTime"]))
                        {
                            entity.FactorEndTime = (DateTime)row["FactorEndTime"];
                        }
                        if (!Convert.IsDBNull(row["OccurrenceProvinceID"]))
                        {
                            entity.OccurrenceProvinceID = (int)row["OccurrenceProvinceID"];
                        }
                        if (!Convert.IsDBNull(row["OccurrenceCityID"]))
                        {
                            entity.OccurrenceCityID = (int)row["OccurrenceCityID"];
                        }
                        entity.OccurrenceArea = row["OccurrenceArea"].ToString();
                        entity.OccurrenceTown = row["OccurrenceTown"].ToString();
                        entity.OccurrenceVillage = row["OccurrenceVillage"].ToString();
                        entity.OccurrenceHamlet = row["OccurrenceHamlet"].ToString();
                        entity.OccurrenceKeyword = row["OccurrenceKeyword"].ToString();
                        entity.SubjectionUnit = row["SubjectionUnit"].ToString();
                        entity.EventUnit = row["EventUnit"].ToString();
                        if (!Convert.IsDBNull(row["DeadCount"]))
                        {
                            entity.DeadCount = (int)row["DeadCount"];
                        }
                        if (!Convert.IsDBNull(row["InjuryCount"]))
                        {
                            entity.InjuryCount = (int)row["InjuryCount"];
                        }
                        if (!Convert.IsDBNull(row["LostCount"]))
                        {
                            entity.LostCount = (int)row["LostCount"];
                        }
                        if (!Convert.IsDBNull(row["LostPropertyCount"]))
                        {
                            entity.LostPropertyCount = (int)row["LostPropertyCount"];
                        }
                        entity.LostBelongings = row["LostBelongings"].ToString();
                        entity.EventDescription = row["EventDescription"].ToString();
                        entity.FirstMedia = row["FirstMedia"].ToString();
                        entity.FirstWeibo = row["FirstWeibo"].ToString();
                        entity.FirstWeiboUser = row["FirstWeiboUser"].ToString();
                        if (!Convert.IsDBNull(row["FirstWeiboDate"]))
                        {
                            entity.FirstWeiboDate = (DateTime)row["FirstWeiboDate"];
                        }
                        entity.FirstWeiboLink = row["FirstWeiboLink"].ToString();
                        entity.FirstWeiboContent = row["FirstWeiboContent"].ToString();
                        if (!Convert.IsDBNull(row["CreateDate"]))
                        {
                            entity.CreateDate = (DateTime)row["CreateDate"];
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
                strSql.Append(" FROM CaseEvent(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }
            public DataSet GetDataSet(string strWhere)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(@"SELECT EventID,EventName,EventKeywords, dbo.f_split(EventCategoryID) as EventCategoryID,dbo.f_split( EventAccidentTypeID ) as EventAccidentTypeID,OccurrenceTime,EventHolidayName,HolidayBeginTime,HolidayEndTime,PoliticsFactorName,FactorBeginTime,FactorEndTime,OccurrenceProvinceID,OccurrenceCityID,OccurrenceArea,OccurrenceTown,OccurrenceVillage,OccurrenceHamlet,OccurrenceKeyword,SubjectionUnit,EventUnit,DeadCount,InjuryCount,LostCount,LostPropertyCount,LostBelongings,EventDescription,FirstMedia,FirstWeibo,FirstWeiboUser,FirstWeiboDate,FirstWeiboLink,FirstWeiboContent,CreateDate FROM dbo.CaseEvent");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                return sqlHelper.ExecuteDateSet(strSql.ToString(), null);
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from CaseEvent ";
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

                    sql += " (ORDER BY EventID)";//默认按主键排序

                }

                sql += " AS RowNumber,(SELECT ProvinceCity FROM dbo.CaseProvinceCity WHERE ID= OccurrenceProvinceID) AS ProvinceName,(SELECT ProvinceCity FROM dbo.CaseProvinceCity WHERE ID= OccurrenceCityID) AS CityName,* FROM CaseEvent";

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
