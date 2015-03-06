using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Util;

namespace BLL.Idol
{
    public abstract class ResultDisplay
    {
        public IList<IdolNewsEntity> list = new List<IdolNewsEntity>();

        public abstract string Display();


    }

    public class FirstStyleDis : ResultDisplay
    {
        public override string Display()
        {

            Dictionary<string, string> tagDict = new Dictionary<string, string>();
            tagDict.Add("other", "");
            tagDict.Add("news", "n");
            tagDict.Add("comment", "c");
            tagDict.Add("p", "p");
            tagDict.Add("n", "n");
            tagDict.Add("m", "");
            string totalcount = "0";
            StringBuilder jsonstr = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                totalcount = list[0].TotalCount;
                StringBuilder html = new StringBuilder();
                foreach (IdolNewsEntity entity in list)
                {
                    string Tag = tagDict[entity.DocType] + tagDict[entity.Tag];
                    html.AppendFormat("<li><dl><dt><input id=\"" + entity.DocId + "\" type=\"checkbox\" class=\"selected_doc\" pid=\"{1}\" />{0}</dt><dd class=\"l_title\"><a href=\"{1}\" title=\"{2}\" target=\"_blank\">", entity.weight + "%", entity.Href, entity.Title);
                    html.AppendFormat("{0}</a></dd>", (entity.Title.Length > 27) ? entity.Title.Substring(0, 27) + "..." : entity.Title);
                    html.Append("<dd class=\"l_tag\"><span><font color='black'>" + Tag + "</font>&nbsp;&nbsp;" + entity.SiteName + "</span> - " + entity.TimeStr + "</dd>");
                    html.AppendFormat("<dd class=\"l_content\">{0}<b>...</b></dd>", entity.Content);
                    html.Append("</dl></li>");
                }
                jsonstr.Append("{\"HtmlStr\":\"");
                jsonstr.Append(EncodeByEscape.GetEscapeStr(html.ToString()));
                jsonstr.Append("\",\"TotalCount\":\"");
                jsonstr.Append(totalcount);
                jsonstr.Append("\"}");
            }
            return jsonstr.ToString();
        }
    }

    public class SecondStyleDis : ResultDisplay
    {
        public override string Display()
        {
            string totalcount = "0";
            StringBuilder jsonstr = new StringBuilder();

            if (list != null && list.Count > 0)
            {
                totalcount = list[0].TotalCount;
                StringBuilder html = new StringBuilder();
                foreach (IdolNewsEntity entity in list)
                {
                    html.AppendFormat("<li><h2><a href=\"{0}\" title=\"{1}\" target=\"_blank\">", entity.Href, entity.Title);
                    html.AppendFormat("{0}</a></h2>", (entity.Title.Length > 27) ? entity.Title.Substring(0, 27) + "..." : entity.Title);
                    html.Append("<div class=\"d\"><span>&nbsp;&nbsp;" + entity.SiteName + "</span> - " + entity.TimeStr + "</div>");
                    html.AppendFormat("<p>{0}<b>...</b></p>", entity.Content);
                    html.Append("</li>");
                }
                jsonstr.Append("{\"HtmlStr\":\"");
                jsonstr.Append(EncodeByEscape.GetEscapeStr(html.ToString()));
                jsonstr.Append("\",\"TotalCount\":\"");
                jsonstr.Append(totalcount);
                jsonstr.Append("\"}");
            }
            return jsonstr.ToString();
        }
    }

    public class ThirdStyleDis : ResultDisplay
    {
        public override string Display()
        {
            int count = 0;
            StringBuilder html = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                foreach (IdolNewsEntity entity in list)
                {
                    var Articletitle = entity.Title;
                    html.Append("<li><div class=\"trainSelect\"><input  type=\"checkbox\" name=\"train_article_list\" id=\"article_" + entity.DocId + "\" pid=\"" + entity.Href + "\"/>&nbsp;</div>");

                    html.AppendFormat("<h2><a href=\"{0}\" title=\"{1}\" target=\"_blank\">", entity.Href, Articletitle);
                    html.AppendFormat("{0}</a></h2>", (Articletitle.Length > 27) ? Articletitle.Substring(0, 27) + "..." : Articletitle);
                    html.AppendFormat("<div class=\"d\"><span>{0}</span> - {1}</div>", entity.SiteName, entity.TimeStr);
                    html.AppendFormat("<p>{0}<b>...</b></p>", entity.Content);
                    html.Append("</li>");
                    if (count == list.Count - 1)
                    {
                        html.Replace('※', ' ');
                        html.Append("※" + entity.TotalCount.ToString());
                    }
                    count++;
                }
            }
            return html.ToString();
        }
    }

    public class ForthStyleDis : ResultDisplay
    {
        public override string Display()
        {
            string totalcount = "0";
            StringBuilder html = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                totalcount = list[0].TotalCount;

                foreach (IdolNewsEntity entity in list)
                {
                    html.AppendFormat("<div id=\"idol_article_{0}\">", entity.DocId);
                    html.AppendFormat("<div class=\"gw_news_title\"><a href=\"{0}\" target=\"_blank\">{1}</a><span>{2}</span><span>{3}</span></div>", entity.Href, entity.Title, entity.TimeStr, entity.SiteName);
                    html.AppendFormat("<div class=\"gw_news_text\">{0}</div>", entity.Content);
                    //html.AppendFormat("<a name=\"article_delete\" class=\"btn_delete\" pid=\"{0}\" href=\"javascript:void(null);\">删除</a>", entity.DocId);
                    html.Append("<div style=\"display: none; width:100%;\" name=\"doc_").Append(entity.DocId).Append("\" class=\"gw_news_info\"> <img border=\"0\"  src=\"img/info.gif\"></div><br/>");
                    html.AppendFormat("<div style=\"display: none; width:100%;\" name=\"doc_{0}\" id=\"suggest_{1}\"></div></div>", entity.DocId, entity.DocId);
                }
                html.Replace('※', ' ');
                html.Append("※" + totalcount);
            }
            return html.ToString();
        }
    }

    public class FifthStyleDIs : ResultDisplay
    {
        public override string Display()
        {
            string totalcount = "0";
            StringBuilder jsonstr = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                totalcount = list[0].TotalCount;
                StringBuilder html = new StringBuilder();
                foreach (IdolNewsEntity entity in list)
                {
                    html.Append("<li><h2><span id=\"sentiment_" + entity.DocId + "\">");
                    if (entity.Tag == "n")
                    {
                        html.Append("【负面】&nbsp;&nbsp;");
                    }
                    else if (entity.Tag == "p")
                    {
                        html.Append("【正面】&nbsp;&nbsp;");
                    }
                    else if (entity.Tag == "m")
                    {
                        html.Append("【中立】&nbsp;&nbsp;");
                    }
                    html.AppendFormat("</span><a href=\"{0}\" title=\"{1}\" target=\"_blank\">", entity.Href, entity.Title);
                    html.AppendFormat("{0}</a></h2>", (entity.Title.Length > 20) ? entity.Title.Substring(0, 20) + "..." : entity.Title);
                    html.Append("<div class=\"d\"><span>&nbsp;&nbsp;" + entity.SiteName + "</span> - " + entity.TimeStr + "</div>");
                    html.AppendFormat("<p>{0}<b>...</b></p>", entity.Content);
                    html.Append("<div style=\"text-align:center; height:25px; line-height:25px;\"><span  name=\"comment_div\" style=\"display:none;\">");
                    html.AppendFormat("【<a href=\"javascript:void(null);\" pid=\"{0}\"  id=\"btn_design_bad\">设置为有害</a>】&nbsp;&nbsp;&nbsp;&nbsp;", entity.DocId);
                    html.AppendFormat("【<a href=\"javascript:void(null);\" pid=\"{0}\" id=\"btn_design_neutral\">删除该文章</a>】", entity.DocId);
                    html.Append("</span></div></li>");
                }
                jsonstr.Append("{\"HtmlStr\":\"");
                jsonstr.Append(EncodeByEscape.GetEscapeStr(html.ToString()));
                jsonstr.Append("\",\"TotalCount\":\"");
                jsonstr.Append(totalcount);
                jsonstr.Append("\"}");
            }
            return jsonstr.ToString();
        }
    }

    public class JsonStyleDis : ResultDisplay
    {
        public override string Display()
        {
            int count = 1;
            StringBuilder jsonstr = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                jsonstr.Append("{");
                string totalcount = list[0].TotalCount;
                jsonstr.AppendFormat("\"totalcount\":{0},", totalcount);
                foreach (IdolNewsEntity entity in list)
                {
                    jsonstr.AppendFormat("\"entity_{0}\":", count);
                    jsonstr.Append("{");
                    jsonstr.AppendFormat("\"title\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.Title));
                    jsonstr.AppendFormat("\"href\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.Href));
                    jsonstr.AppendFormat("\"time\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.TimeStr));
                    jsonstr.AppendFormat("\"site\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.SiteName));
                    jsonstr.AppendFormat("\"author\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.Author));
                    jsonstr.AppendFormat("\"replynum\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.ReplyNum));
                    jsonstr.AppendFormat("\"clicknum\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.ClickNum));
                    jsonstr.AppendFormat("\"docid\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.DocId));
                    jsonstr.AppendFormat("\"content\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.Content));
                    jsonstr.AppendFormat("\"allcontent\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.AllContent));
                    jsonstr.AppendFormat("\"conturl\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.ContUrl));
                    jsonstr.AppendFormat("\"samenum\":\"{0}\",", entity.SameNum);
                    jsonstr.AppendFormat("\"weight\":\"{0}\"", EncodeByEscape.GetEscapeStr(entity.weight));
                    jsonstr.Append("},");
                    count++;
                }
                jsonstr.Append("\"Success\":1}");
            }
            return jsonstr.ToString();
        }
    }

    public class SevenStyleDis : ResultDisplay
    {
        public override string Display()
        {

            Dictionary<string, string> tagDict = new Dictionary<string, string>();
            tagDict.Add("other", "");
            tagDict.Add("news", "n");
            tagDict.Add("comment", "c");
            tagDict.Add("p", "p");
            tagDict.Add("n", "n");
            tagDict.Add("m", "");
            string totalcount = "0";
            StringBuilder html = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                int count = 0;
                totalcount = list[0].TotalCount;

                foreach (IdolNewsEntity entity in list)
                {
                    string Tag = tagDict[entity.DocType] + tagDict[entity.Tag];
                    html.AppendFormat("<li><dl><dt><input id=\"" + entity.DocId + "\" type=\"checkbox\" class=\"selected_doc\" pid=\"{1}\" />{0}</dt><dd class=\"l_title\"><a href=\"{1}\" title=\"{2}\" target=\"_blank\">", entity.weight + "%", entity.Href, entity.Title);
                    html.AppendFormat("{0}</a></dd>", (entity.Title.Length > 27) ? entity.Title.Substring(0, 27) + "..." : entity.Title);
                    html.Append("<dd class=\"l_tag\"><span><font color='black'>" + Tag + "</font>&nbsp;&nbsp;" + entity.SiteName + "</span> - " + entity.TimeStr + "</dd>");
                    html.AppendFormat("<dd class=\"l_content\">{0}<b>...</b></dd>", entity.Content);
                    html.Append("</dl></li>");
                    if (count == list.Count - 1)
                    {
                        html.Replace('※', ' ');
                        html.Append("※" + totalcount.ToString());
                    }
                    count++;
                }

            }
            return html.ToString();
        }
    }
    /// <summary>
    /// 微博话题
    /// </summary>
    public class EightStyleDis : ResultDisplay
    {
        public override string Display()
        {
            int count = 1;
            StringBuilder jsonstr = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                jsonstr.Append("{");
                string totalcount = list[0].TotalCount;
                jsonstr.AppendFormat("\"totalcount\":{0},", totalcount);
                foreach (IdolNewsEntity entity in list)
                {
                    jsonstr.AppendFormat("\"entity_{0}\":", count);
                    jsonstr.Append("{");
                    jsonstr.AppendFormat("\"DISPLAYCONTENT\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.AllContent));
                    jsonstr.AppendFormat("\"SITENAME\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.SiteName));
                    jsonstr.AppendFormat("\"REPLYNUM\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.ReplyNum));
                    jsonstr.AppendFormat("\"TIMESTAMP\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.TimesTamp));
                    jsonstr.AppendFormat("\"AUTHORURL\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.AuthorURL));
                    jsonstr.AppendFormat("\"AUTHORNAME\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.AuthorName));
                    jsonstr.AppendFormat("\"FORWARDNUM\":\"{0}\"", EncodeByEscape.GetEscapeStr(entity.ForwardNum));

                    jsonstr.Append("},");
                    count++;
                }
                jsonstr.Append("\"Success\":1}");
            }
            return jsonstr.ToString();
        }
    }

    /**/
    public class NinthStyleDis : ResultDisplay
    {
        public override string Display()
        {
            int count = 1;
            StringBuilder jsonstr = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                jsonstr.Append("{");
                string totalcount = list[0].TotalCount;
                jsonstr.AppendFormat("\"totalcount\":{0},", totalcount);
                jsonstr.Append("\"data\":[");
                foreach (IdolNewsEntity entity in list)
                {
                    //jsonstr.AppendFormat("\"entity_{0}\":", count);
                    jsonstr.Append("{");
                    jsonstr.AppendFormat("\"docId\":\"{0}\",", entity.DocId);
                    //昵称
                    jsonstr.AppendFormat("\"authorName\":\"{0}\",", entity.AuthorName);
                    //头像
                    jsonstr.AppendFormat("\"profileImageUrl\":\"{0}\",", entity.ProfileImageUrl);
                    //是否+V
                    jsonstr.AppendFormat("\"isVip\":\"{0}\",", entity.IsVip);
                    //地址X
                    //性别
                    jsonstr.AppendFormat("\"gender\":\"{0}\",", entity.Gender);
                    //关注数
                    jsonstr.AppendFormat("\"friendsCount\":\"{0}\",", entity.FriendsCount);
                    //微博数
                    jsonstr.AppendFormat("\"statusesCount\":\"{0}\",", entity.StatusesCount);
                    //转发数
                    jsonstr.AppendFormat("\"forwardNum\":\"{0}\",", entity.ForwardNum);
                    //个人微博地址
                    jsonstr.AppendFormat("\"authorUrl\":\"{0}\",", entity.AuthorURL);
                    //+V说明 VERIFIED_REASON
                    jsonstr.AppendFormat("\"verifiedReason\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.VerifiedReason));
                    //各种勋章X
                    //微博时间 
                    jsonstr.AppendFormat("\"timesTamp\":\"{0}\",", entity.TimesTamp);
                    //来源SITENAME
                    jsonstr.AppendFormat("\"siteName\":\"{0}\",", entity.SiteName);
                    //收藏数X
                    //粉丝数
                    jsonstr.AppendFormat("\"followersCount\":\"{0}\",", entity.FollowersCount);
                    //内容
                    jsonstr.AppendFormat("\"dreContent\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.DreContent));
                    //评论数
                    jsonstr.AppendFormat("\"replyNum\":\"{0}\",", entity.ReplyNum);
                    //原图
                    jsonstr.AppendFormat("\"originalPic\":\"{0}\",", entity.OriginalPic);
                    //父微博ID
                    jsonstr.AppendFormat("\"retweetId\":\"{0}\",", entity.RetweetId);
                    //微博ID
                    jsonstr.AppendFormat("\"itemId\":\"{0}\",", entity.ItemId);
                    //微博来源类型
                    jsonstr.AppendFormat("\"webSource\":\"{0}\",", entity.WebSource);
                    //Idol数据库ID
                    jsonstr.AppendFormat("\"reference\":\"{0}\",", entity.Href);
                    //新闻性质 正负中
                    jsonstr.AppendFormat("\"emotion\":\"{0}\",", entity.Emotion);
                    //账号
                    jsonstr.AppendFormat("\"authorgtrueName\":\"{0}\",", entity.AuthorgtrueName);
                    //大头像
                    jsonstr.AppendFormat("\"avartarLarge\":\"{0}\",", entity.AvartarLarge);
                    //是否关注
                    jsonstr.AppendFormat("\"isFollower\":\"{0}\",", entity.IsFollower);
                    //是否收藏
                    //IsFavorite
                    jsonstr.AppendFormat("\"isFavorite\":\"{0}\",", entity.IsFavorite);
                    //Links
                    jsonstr.AppendFormat("\"links\":\"{0}\",", entity.Links);
                    //微博原文URL
                    jsonstr.AppendFormat("\"url\":\"{0}\",", entity.WeiboUrl);
                    //缩略图
                    jsonstr.AppendFormat("\"thumbnailPic\":\"{0}\"", entity.ThumbnailPic);
                    //Href


                    jsonstr.Append("},");
                    // count++;

                }
                jsonstr.Remove(jsonstr.Length - 1, 1);
                jsonstr.Append("],");
                jsonstr.Append("\"Success\":1}");
            }
            return jsonstr.ToString();
        }
    }

    public class TenthStyleDis : ResultDisplay
    {
        public override string Display()
        {
            int count = 1;
            StringBuilder jsonstr = new StringBuilder();
            if (list != null && list.Count > 0)
            {
                jsonstr.Append("{");
                string totalcount = list[0].TotalCount;
                jsonstr.AppendFormat("\"totalcount\":{0},", totalcount);
                jsonstr.Append("\"data\":[");
                foreach (IdolNewsEntity entity in list)
                {
                    jsonstr.Append("{");
                    jsonstr.AppendFormat("\"docId\":\"{0}\",", entity.DocId);
                    jsonstr.AppendFormat("\"href\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.Href));
                    jsonstr.AppendFormat("\"title\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.Title));
                    jsonstr.AppendFormat("\"datetime\":\"{0}\",", entity.StrDatetime);
                    jsonstr.AppendFormat("\"videoId\":\"{0}\",", entity.VideoId);
                    jsonstr.AppendFormat("\"siteName\":\"{0}\",", EncodeByEscape.GetEscapeStr(entity.SiteName));
                    jsonstr.AppendFormat("\"videofilePath\":\"{0}\",", entity.VideoFilePath.Trim());
                    jsonstr.AppendFormat("\"videoFileCount\":\"{0}\",", entity.VideoFileCount);
                    jsonstr.AppendFormat("\"videoShortLink\":\"{0}\",", entity.VideoShortLink);
                    jsonstr.AppendFormat("\"videoThumbPic\":\"{0}\",", entity.VideoThumbPic);
                    jsonstr.AppendFormat("\"creContent\":\"{0}\"", EncodeByEscape.GetEscapeStr(entity.DreContent.Trim()));
                    jsonstr.Append("},");
                }
                jsonstr.Remove(jsonstr.Length - 1, 1);
                jsonstr.Append("],");
                jsonstr.Append("\"Success\":1}");
            }
            return jsonstr.ToString();
        }
    }



    public class DisplayFactory
    {
        public static ResultDisplay GetDisStyle(DisplayType disType)
        {
            switch (disType)
            {
                case DisplayType.FirstDisplay:
                    return new FirstStyleDis();
                case DisplayType.SecondDisplay:
                    return new SecondStyleDis();
                case DisplayType.ThirdStyleDis:
                    return new ThirdStyleDis();
                case DisplayType.ForthStyleDis:
                    return new ForthStyleDis();
                case DisplayType.FifthStyleDis:
                    return new FifthStyleDIs();
                case DisplayType.SixthStyleDis:
                    return new JsonStyleDis();
                case DisplayType.SevevStyleDis:
                    return new SevenStyleDis();
                case DisplayType.EightStyleDis:
                    return new EightStyleDis();
                case DisplayType.NinthStyleDis:
                    return new NinthStyleDis();
                case DisplayType.TenthStyleDis:
                    return new TenthStyleDis();
                default:
                    return null;
            }
        }
    }

    public enum DisplayType
    {
        FirstDisplay = 1,
        SecondDisplay = 2,
        ThirdStyleDis = 3,
        ForthStyleDis = 4,
        FifthStyleDis = 5,
        SixthStyleDis = 6,
        SevevStyleDis = 7,
        EightStyleDis = 8,
        NinthStyleDis = 9,
        TenthStyleDis = 10

    }
}
