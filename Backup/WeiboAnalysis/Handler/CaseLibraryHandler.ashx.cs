using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;
using DBDAL.Entity;
using System.Text;
using BLL.Idol;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// CaseLibraryHandler 的摘要说明
    /// </summary>
    public class CaseLibraryHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                context.Response.ContentType = "text/plain";
                string act = context.Request["action"].ToString();
                string result = "{\"success\":0}";
                switch (act)
                {
                    case "createevent":
                        //创建事件
                        result = CreateEvents(context);
                        break;
                    case "firststeps":
                        result = FirstSteps(context);
                        break;
                    case "steptwo":
                        break;
                    case "thirdstep":
                        result = ThirdStep(context);
                        break;
                    case "getlist":
                        result = GetCaseList(context);
                        break;
                    case "getlistbywhere":
                        result = GetCaseListByWhere(context);
                        break;
                    case "duibi":
                        result = GetDuibiData(context);
                        break;
                    case "byid":
                        result = GetCaseById(context);
                        break;
                    case "GetQueryTagValues":
                        result = GetCategoryEventInfo(context);
                        break;
                    case "savekeywords":
                        result = SaveKeywords(context);
                        break;
                    case "delcase":
                        result = DelCaseEventById(context);
                        break;
                    case "updateeventsname":
                        result = UpdateEventsName(context);
                        break;
                    default:
                        break;
                }
                //context.Response.ContentType = "text/plain";
                context.Response.Write(result);
            }
            catch (Exception e)
            {
                string result = "{\"errormsg\":\"" + e.ToString() + "\"}";
                context.Response.Write(result);
            }

        }

        //取列表信息
        private string GetCaseList(HttpContext context)
        {
            string result = "{\"success\":0}";
            string jsonData = "";
            int totalCount = 1;
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            String pageWhere = context.Request["where"];
            pageWhere = "CreateDate>='" + DateTime.Now.AddYears(-1).ToString("yyyy") + "-01-01'";
            pageWhere += " AND CreateDate<='" + DateTime.Now.ToString("yyyy-MM-dd") + "'";
            String pageOrderBy = context.Request["orderBy"];
            jsonData = CaseEventFacade.GetEventsList(pageWhere, null, pageOrderBy, int.Parse(PageSize), int.Parse(Start)).ToJson();
            totalCount = CaseEventFacade.GetTotalCount(pageWhere, null);
            if (jsonData == null || jsonData == "")
            {
                jsonData = "0";
            }
            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            return result;
        }
        private string GetCaseListByWhere(HttpContext context)
        {
            string result = "{\"success\":0}";
            string jsonData = "";
            int totalCount = 1;
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            String pageWhere = "";// context.Request["where"];
            String pageOrderBy = context.Request["orderBy"];
            StringBuilder sbuder = new StringBuilder();
            sbuder.Append(" 1=1 ");
            string startTime = context.Request["startTime"];
            if (!string.IsNullOrEmpty(startTime))
            {
                sbuder.AppendFormat(" AND OccurrenceTime>='{0}'", startTime);
            }
            string endTime = context.Request["endTime"];
            if (!string.IsNullOrEmpty(endTime))
            {
                sbuder.AppendFormat(" AND OccurrenceTime<='{0}'", endTime);
            }
            string province = context.Request["province"];
            if (!string.IsNullOrEmpty(province))
            {
                sbuder.AppendFormat(" AND OccurrenceProvinceID={0}", province);
            }
            string city = context.Request["city"];
            if (!string.IsNullOrEmpty(city))
            {
                sbuder.AppendFormat(" AND OccurrenceCityID={0}", city);
            }
            string areaKeywork = context.Request["areaKeywork"];
            if (!string.IsNullOrEmpty(areaKeywork))
            {
                sbuder.AppendFormat(" AND OccurrenceKeyword='{0}'", areaKeywork);
            }
            string eventGroup = context.Request["eventGroup"]; //事故分类
            if (!string.IsNullOrEmpty(eventGroup))
            {
                sbuder.AppendFormat(" AND EventCategoryID like'%{0}%'", eventGroup);
            }
            string eventType = context.Request["eventType"]; //事故类型
            if (!string.IsNullOrEmpty(eventType))
            {
                sbuder.AppendFormat(" AND EventAccidentTypeID like '%{0}%'", eventType);
            }
            string eventLSDW = context.Request["eventLSDW"];
            if (!string.IsNullOrEmpty(eventLSDW))
            {
                sbuder.AppendFormat(" AND SubjectionUnit='{0}'", eventLSDW);
            }
            string eventSJDW = context.Request["eventSJDW"];
            if (!string.IsNullOrEmpty(eventSJDW))
            {
                sbuder.AppendFormat(" AND EventUnit='{0}'", eventSJDW);
            }
            string deadNumber = context.Request["deadNumber"];
            if (!string.IsNullOrEmpty(deadNumber))
            {
                sbuder.AppendFormat(" AND DeadCount>={0}", deadNumber);
            }
            string deadMax = context.Request["deadMax"];
            if (!string.IsNullOrEmpty(deadMax))
            {
                sbuder.AppendFormat(" AND DeadCount<={0}", deadNumber);
            }
            string injuryNumber = context.Request["injuryNumber"];
            if (!string.IsNullOrEmpty(injuryNumber))
            {
                sbuder.AppendFormat(" AND InjuryCount>={0}", injuryNumber);
            }
            string injuryMax = context.Request["injuryMax"];
            if (!string.IsNullOrEmpty(injuryMax))
            {
                sbuder.AppendFormat(" AND InjuryCount<={0}", injuryMax);
            }
            string lostNumber = context.Request["lostNumber"];
            if (!string.IsNullOrEmpty(lostNumber))
            {
                sbuder.AppendFormat(" AND LostCount>={0}", lostNumber);
            }
            string loatMax = context.Request["loatMax"];
            if (!string.IsNullOrEmpty(loatMax))
            {
                sbuder.AppendFormat(" AND LostCount<={0}", loatMax);
            }
            string lostMinMonery = context.Request["lostMinMonery"];
            if (!string.IsNullOrEmpty(lostMinMonery))
            {
                sbuder.AppendFormat(" AND LostBelongings>={0}", lostMinMonery);
            }
            string lostMaxMonery = context.Request["lostMaxMonery"];
            if (!string.IsNullOrEmpty(lostNumber))
            {
                sbuder.AppendFormat(" AND LostCount<={0}", lostMaxMonery);
            }
            string eventDescription = context.Request["eventDescription"];
            if (!string.IsNullOrEmpty(eventDescription))
            {
                sbuder.AppendFormat(" AND EventDescription='{0}'", eventDescription.Replace("\n", ""));
            }
            string firstMeiTi = context.Request["firstMeiTi"];
            if (!string.IsNullOrEmpty(firstMeiTi))
            {
                sbuder.AppendFormat(" AND FirstMedia={0}", firstMeiTi);
            }
            string firstWeibo = context.Request["firstWeibo"];
            if (!string.IsNullOrEmpty(firstWeibo))
            {
                sbuder.AppendFormat(" AND FirstWeibo={0}", firstWeibo);
            }
            string userName = context.Request["userName"];
            if (!string.IsNullOrEmpty(userName))
            {
                sbuder.AppendFormat(" AND FirstWeiboUser='{0}'", userName);
            }

            pageWhere = sbuder.ToString();
            jsonData = CaseEventFacade.GetEventsList(pageWhere, null, pageOrderBy, int.Parse(PageSize), int.Parse(Start)).ToJson();
            jsonData = jsonData == null ? "\"0\"" : jsonData;
            totalCount = CaseEventFacade.GetTotalCount(pageWhere, null);
            result = "{\"success\":1,\"data\":" + jsonData + ",\"Count\":" + totalCount + "}";
            return result;
        }
        private string UpdateEventsName(HttpContext context)
        {
            string result = "{\"success\":1}";
            try
            {
                string eventName = context.Request["EventName"].Trim().ToString().Replace("\"", "\\\"");
                string id = context.Request["eid"].ToString();
                int totalCount = CaseEventFacade.GetTotalCount("EventName='" + eventName + "'", null);
                if (totalCount > 0)
                {
                    result = "{\"success\":2}";
                }
                else
                {
                    var entity = CaseEventFacade.GetCaseEventEntityById(id);
                    entity.EventName = eventName;
                    CaseEventFacade.UpdateEvent(entity);
                }
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }
        private string CreateEvents(HttpContext context)
        {
            string result = "{\"success\":0}";
            string eventName = context.Request["EventName"].Trim().ToString().Replace("\"", "\\\"");
            string eventKeywords = context.Request["EventKeywords"].Trim().ToString().Replace("\"", "\\\"").Replace("\n", "\\n");
            DateTime createTime = DateTime.Today;
            int totalCount = CaseEventFacade.GetTotalCount("EventName='" + eventName + "'", null);
            if (totalCount > 0)
            {
                //名字重复
                result = "{\"success\":2}";
            }
            else
            {
                CaseEventFacade.AddNewEvent(eventName, eventKeywords, createTime);
                string eId = CaseEventFacade.GetNewEventId(eventName, eventKeywords);
                if (!string.IsNullOrEmpty(eId))
                {
                    result = "{\"success\":1,\"eventid\":\"" + eId + "\"}";
                }
            }

            return result;
        }
        private string FirstSteps(HttpContext context)
        {
            string result = "{\"success\":1}";
            string EventID = context.Request["eid"].ToString();
            string EventHolidayName = context.Request["EventHolidayName"].ToString().Replace("\"", "\\\"");
            string OccurrenceTime = context.Request["OccurrenceTime"].ToString();
            string HolidayBeginTime = context.Request["HolidayBeginTime"].ToString();
            string HolidayEndTime = context.Request["HolidayEndTime"].ToString();
            string PoliticsFactorName = context.Request["PoliticsFactorName"].ToString().Replace("\"", "\\\""); ;
            string FactorBeginTime = context.Request["FactorBeginTime"].ToString();
            string FactorEndTime = context.Request["FactorEndTime"].ToString();
            string OccurrenceProvinceID = context.Request["OccurrenceProvinceID"].ToString();
            string OccurrenceCityID = context.Request["OccurrenceCityID"].ToString();
            string OccurrenceArea = context.Request["OccurrenceArea"].ToString();
            string OccurrenceTown = context.Request["OccurrenceTown"].ToString();
            string OccurrenceVillage = context.Request["OccurrenceVillage"].ToString();
            string OccurrenceHamlet = context.Request["OccurrenceVillage"].ToString();
            string OccurrenceKeyword = context.Request["OccurrenceKeyword"].ToString();
            string SubjectionUnit = context.Request["SubjectionUnit"].ToString();
            string EventUnit = context.Request["EventUnit"].ToString();
            string DeadCount = context.Request["DeadCount"].ToString();
            string InjuryCount = context.Request["InjuryCount"].ToString();
            string LostCount = context.Request["LostCount"].ToString();
            string LostBelongings = context.Request["LostBelongings"].ToString();
            string EventDescription = context.Request["EventDescription"].ToString().Replace("\n", "\\n").Replace("\"", "\\\""); ;
            string EventKeywords = context.Request["EventKeywords"].Replace("\"", "\\\""); ;

            string EventCategoryID = context.Request["EventCategoryID"].ToString();
            string EventAccidentTypeID = context.Request["EventAccidentTypeID"].ToString();


            CaseEventEntity model = CaseEventFacade.GetCaseEventEntityById(EventID); // new CaseEventEntity();

            //model.EventID = int.Parse(EventID);
            model.EventCategoryID = EventCategoryID;
            model.EventAccidentTypeID = EventAccidentTypeID;
            model.EventHolidayName = EventHolidayName;
            if (!string.IsNullOrEmpty(OccurrenceTime))
            {
                model.OccurrenceTime = DateTime.Parse(OccurrenceTime);
            }
            if (!string.IsNullOrEmpty(HolidayBeginTime))
            {
                model.HolidayBeginTime = DateTime.Parse(HolidayBeginTime);
            }
            if (!string.IsNullOrEmpty(HolidayEndTime))
            {
                model.HolidayEndTime = DateTime.Parse(HolidayEndTime);
            }
            model.PoliticsFactorName = PoliticsFactorName;
            if (!string.IsNullOrEmpty(FactorBeginTime))
            {
                model.FactorBeginTime = DateTime.Parse(FactorBeginTime);
            }
            if (!string.IsNullOrEmpty(FactorEndTime))
            {
                model.FactorEndTime = DateTime.Parse(FactorEndTime);
            }
            if (!string.IsNullOrEmpty(EventKeywords))
            {
                EventKeywords = EventKeywords.Replace("，", ",");
                model.EventKeywords = EventKeywords;
            }
            if (!string.IsNullOrEmpty(OccurrenceProvinceID))
            {
                model.OccurrenceProvinceID = int.Parse(OccurrenceProvinceID);
            }

            if (!string.IsNullOrEmpty(OccurrenceCityID))
            {
                model.OccurrenceCityID = int.Parse(OccurrenceCityID);
            }

            model.OccurrenceArea = OccurrenceArea;
            model.OccurrenceTown = OccurrenceTown;
            model.OccurrenceVillage = OccurrenceVillage;
            model.OccurrenceHamlet = OccurrenceHamlet;
            model.OccurrenceKeyword = OccurrenceKeyword;
            model.SubjectionUnit = SubjectionUnit;
            model.EventUnit = EventUnit;
            if (!string.IsNullOrEmpty(DeadCount))
            {
                model.DeadCount = int.Parse(DeadCount);
            }
            if (!string.IsNullOrEmpty(InjuryCount))
            {
                model.InjuryCount = int.Parse(InjuryCount);
            }
            if (!string.IsNullOrEmpty(LostCount))
            {
                model.LostCount = int.Parse(LostCount);
            }
            model.LostBelongings = LostBelongings;
            model.EventDescription = EventDescription;
            try
            {
                CaseEventFacade.UpdateEvent(model);
            }
            catch
            {
                result = "{\"success\":0}";
            }
            return result;
        }
        private string ThirdStep(HttpContext context)
        {
            string result = "{\"success\":1}";

            string eid = context.Request["eid"].Trim();
            string FirstMedia = context.Request["FirstMedia"].Trim();
            string FirstWeibo = context.Request["FirstWeibo"].Trim();
            string FirstWeiboUser = context.Request["FirstWeiboUser"].Trim();
            string FirstWeiboDate = context.Request["FirstWeiboDate"].Trim();
            string FirstWeiboLink = context.Request["FirstWeiboLink"].Trim();
            string FirstWeiboContent = context.Request["FirstWeiboContent"].ToString().Replace("\n", "\\n").Replace("\"", "\\\"");

            CaseEventEntity model = CaseEventFacade.GetCaseEventEntityById(eid); //new CaseEventEntity();
            model.EventID = int.Parse(eid);
            model.FirstMedia = FirstMedia;
            model.FirstWeibo = FirstWeibo;
            model.FirstWeiboUser = FirstWeiboUser;
            if (!string.IsNullOrEmpty(FirstWeiboDate))
            {
                model.FirstWeiboDate = DateTime.Parse(FirstWeiboDate);
            }
            model.FirstWeiboLink = FirstWeiboLink;
            model.FirstWeiboContent = FirstWeiboContent;
            try
            {
                CaseEventFacade.UpdateEvent(model);
            }
            catch
            {
                result = "{\"success\":0}";
            }
            return result;
        }
        private string GetDuibiData(HttpContext context)
        {
            string result = "{\"success\":1}";
            string eventId = context.Request["eids"].ToString();
            string jsonData = "", actionData = "";
            try
            {
                jsonData = CaseEventFacade.GetEventsList(eventId).ToJson();
                actionData = CaseActionFacade.GetActionByWhere(eventId).ToJson();
                if (string.IsNullOrEmpty(jsonData)) { jsonData = "0"; }
                if (string.IsNullOrEmpty(actionData)) { actionData = "0"; }
                result = "{\"success\":\"1\",\"data\":" + jsonData + ",\"actiondata\":" + actionData + "}";
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"\":\"" + e.ToString() + "\"}";
            }


            return result;
        }
        private string GetCaseById(HttpContext context)
        {
            string result = "{\"success\":1}";
            string eventId = context.Request["eid"].ToString();
            string jsonData = "";
            try
            {
                jsonData = CaseEventFacade.GetEventsById(eventId).ToJson();
                result = "{\"success\":\"1\",\"data\":" + jsonData + "}";
            }
            catch
            {
                result = "{\"success\":0}";
            }
            return result;
        }

        private string GetCategoryEventInfo(HttpContext context)
        {
            StringBuilder jsonData = new StringBuilder();
            StringBuilder festivalCompreInfo = new StringBuilder();
            festivalCompreInfo.Append("[");
            jsonData.Append("[");
            string eventId = context.Request["eids"].ToString();
            string[] eids = eventId.Split(',');

            for (int i = 0, j = eids.Length; i < j; i++)
            {
                //获取事信息
                CaseEventEntity entity = CaseEventFacade.GetCaseEventEntityById(eids[i]);
                DateTime eTime = DateTime.Now;
                //事件时间

                festivalCompreInfo.Append("{");
                festivalCompreInfo.AppendFormat("\"name\":\"{0}\",", entity.EventName);

                string HolidayBeginTime = "", HolidayEndTime = "", FactorBeginTime = "", FactorEndTime = "";
                if (entity.HolidayBeginTime != null)
                    HolidayBeginTime = ((DateTime)entity.HolidayBeginTime).ToString("yyyy-MM-dd");
                if (entity.HolidayEndTime != null)
                    HolidayEndTime = ((DateTime)entity.HolidayEndTime).ToString("yyyy-MM-dd");
                if (entity.FactorBeginTime != null)
                    FactorBeginTime = ((DateTime)entity.FactorBeginTime).ToString("yyyy-MM-dd");
                if (entity.FactorEndTime != null)
                    FactorEndTime = ((DateTime)entity.FactorEndTime).ToString("yyyy-MM-dd");
                festivalCompreInfo.AppendFormat("\"EventHolidayName\":\"{0}\",", entity.EventHolidayName);
                festivalCompreInfo.AppendFormat("\"HolidayBeginTime\":\"{0}\",", HolidayBeginTime);
                //festivalCompreInfo.AppendFormat("\"HolidayBeginTime\":\"{0}\",", HolidayBeginTime);
                festivalCompreInfo.AppendFormat("\"HolidayEndTime\":\"{0}\",", HolidayEndTime);
                festivalCompreInfo.AppendFormat("\"PoliticsFactorName\":\"{0}\",", entity.PoliticsFactorName);
                festivalCompreInfo.AppendFormat("\"FactorBeginTime\":\"{0}\",", FactorBeginTime);
                festivalCompreInfo.AppendFormat("\"FactorEndTime\":\"{0}\"", FactorEndTime);
                festivalCompreInfo.Append("},");

                string eData = "";
                if (entity.OccurrenceTime == null)
                {
                    eData = "  {\"name\": \"" + entity.EventName + "\",\"data\": [0,0,0,0,0,0,0]}";
                    // eData = "[0,0,0,0,0,0,0]";
                    //jsonData.AppendFormat("{0},", eData);
                }
                else
                {
                    eTime = (DateTime)entity.OccurrenceTime;

                    //获取事件曲线数据
                    //BLL.Idol.QueryParamEntity paramEntity = QueryParamsDao.GetEntity(context);// new QueryParamEntity();
                    BLL.Idol.QueryParamEntity paramEntity = new QueryParamEntity();
                    paramEntity.action = "GetQueryTagValues";
                    paramEntity.Text = entity.EventKeywords; //"爆炸事故";
                    paramEntity.FieldName = "DATENUM";
                    paramEntity.Sort = "ReverseDate";
                    paramEntity.Predict = "false";
                    paramEntity.DocumentCount = true;
                    paramEntity.MinDate = eTime.AddDays(-1).ToString("dd/MM/yyyy");
                    paramEntity.MaxDate = eTime.AddDays(5).ToString("dd/MM/yyyy");
                    // paramEntity.DataBase = context.Request["databasematch"];

                    IdolQuery query = IdolQueryFactory.GetDisStyle(paramEntity.action);
                    paramEntity.DisplayStyle = 9;
                    query.queryParamsEntity = paramEntity;
                    Dictionary<string, string> list = query.GetStaticAllInfo();
                    eData = CategoryEventData(list, entity);
                    if (string.IsNullOrEmpty(eData))
                    {
                        eData = "  {\"name\": \"" + entity.EventName + "\",\"data\": [0,0,0,0,0,0,0]}";
                    }
                }
                jsonData.AppendFormat("{0},", eData);
            }
            if (jsonData.Length > 5)
                jsonData.Remove(jsonData.Length - 1, 1);
            if (festivalCompreInfo.Length > 10)
                festivalCompreInfo.Remove(festivalCompreInfo.Length - 1, 1);
            festivalCompreInfo.Append("]");
            jsonData.Append("]");
            return "{\"success\":0,\"data\":" + jsonData.ToString() + ",\"festivaldata\":" + festivalCompreInfo.ToString() + "}";
        }
        public string CategoryEventData(Dictionary<string, string> list, CaseEventEntity entity)
        {
            string EventHolidayName = entity.EventHolidayName;
            DateTime? HolidayBeginTime = entity.HolidayBeginTime;
            DateTime? HolidayEndTime = entity.HolidayEndTime;
            string PoliticsFactorName = entity.PoliticsFactorName;
            DateTime? FactorBeginTime = entity.FactorBeginTime;
            DateTime? FactorEndTime = entity.FactorEndTime;
            StringBuilder dataBuilder = new StringBuilder();
            dataBuilder.Append("{");
            dataBuilder.AppendFormat("\"name\": \"{0}\",", entity.EventName);
            dataBuilder.Append("\"data\": [");

            foreach (var item in list)
            {
                string s = item.Key;
                bool ispRominent = false;
                string chartName = "";
                string point = "";
                DateTime chartDate = DateTime.ParseExact(item.Key, "yyyyMMdd", null, System.Globalization.DateTimeStyles.AllowInnerWhite);
                if (chartDate >= HolidayBeginTime && chartDate <= HolidayEndTime)
                {
                    ispRominent = true;
                    chartName = EventHolidayName;
                }
                if (chartDate >= FactorBeginTime && chartDate <= FactorEndTime)
                {
                    ispRominent = true;
                    chartName += " " + PoliticsFactorName;
                }
                if (ispRominent)
                {
                    chartName = chartName.Replace(" ", "，");
                    point = "{\"dataLabels\": { \"enabled\": true },\"y\": " + item.Value + ",\"name\": \"" + chartName + "\",\"marker\": {\"enabled\": true,\"fillColor\": \"#ffffff\",\"lineColor\": \"#ff0000\",\"lineWidth\": 1,\"radius\": 5}},";
                }
                else
                {
                    point = item.Value + ",";
                }
                dataBuilder.Append(point);
            }
            if (list.Count == 0)
            {
                dataBuilder.Append("0,0,0,0,0,0,0,");
            }
            dataBuilder.Remove(dataBuilder.Length - 1, 1);
            dataBuilder.Append("]}");
            return dataBuilder.ToString();
        }
        public string SaveKeywords(HttpContext context)
        {
            string result = "{\"success\":1}";
            string EventID = context.Request["eid"].ToString();
            string EventKeywords = context.Request["EventKeywords"];
            CaseEventEntity model = CaseEventFacade.GetCaseEventEntityById(EventID); // new CaseEventEntity();
            model.EventKeywords = EventKeywords.Replace('，', ',').Replace("\"", "\\\"");
            try
            {
                CaseEventFacade.UpdateEvent(model);
            }
            catch
            {
                result = "{\"success\":0}";
            }
            return result;

        }
        public string DelCaseEventById(HttpContext context)
        {
            string result = "{\"success\":1,\"errormsg\":\"\"}";
            try
            {
                string id = context.Request["caseid"];
                CaseEventFacade.DelCaseEvent(Convert.ToInt32(id));
                CaseActionFacade.DelByWhereEventId(Convert.ToInt32(id));
            }
            catch (Exception e)
            {
                result = "{\"success\":1,\"errormsg\":\"" + e.ToString() + "\"}";
            }
            return result;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}