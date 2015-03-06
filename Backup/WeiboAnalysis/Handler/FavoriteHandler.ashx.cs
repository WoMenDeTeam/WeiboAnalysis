using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{

    public class FavoriteHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            String act = context.Request["act"];
            String retJson = "{\"Success\":0}";
            String ID = context.Request["mainid"];
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            string title = "";
            if (!String.IsNullOrEmpty(act))
            {
                try
                {
                    switch (act)
                    {
                        case "getcollect":
                            break;
                        case "initFavorite":
                            int str = Convert.ToInt32(Start);
                            int pageSize = Convert.ToInt32(PageSize);
                            String pageWhere = context.Request["where"];
                            String pageOrderBy = context.Request["orderBy"];
                            int totalCount = FavoriteFacade.GetTotalCount(pageWhere);
                            retJson = FavoriteFacade.GetList(pageWhere, pageOrderBy, pageSize, str).ToJson(totalCount);
                            break;
                        case "insert":
                            int fid = Convert.ToInt32(ID);
                            if (FavoriteFacade.GetFavoriteCountByID(fid) <= 0)
                            {
                                FavoriteFacade.Insert(fid, DateTime.Now);
                                FavoriteStateFacade.AddFavoriteState(fid);
                                retJson = "{\"Success\":1}";
                            }
                            else
                            {
                                retJson = "{\"Success\":2}";
                            }
                            // UserCollectFacade.AddCollect(ID, title);
                            break;
                        case "delete":
                            FavoriteFacade.Del(Convert.ToInt32(ID));
                            FavoriteStateFacade.UpdateFavoriteState(Convert.ToInt32(ID));
                            retJson = "{\"Success\":1}";
                            //UserCollectFacade.DelCollect(0, ID);
                            break;
                        case "deletelist":
                            string strIds = context.Request["ids"];
                            if (!string.IsNullOrEmpty(strIds))
                            {
                                FavoriteFacade.DeleteByWhere(strIds);
                                FavoriteStateFacade.UpdateFavoriteStateList(strIds);
                                retJson = "{\"Success\":1}";
                            }
                            break;
                    }
                }
                catch
                {
                    retJson = "{\"Success\":0}";
                }

            }
            context.Response.Write(retJson);
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
