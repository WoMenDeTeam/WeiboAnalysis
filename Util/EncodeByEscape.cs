using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.JScript;

namespace Util
{
    public static class EncodeByEscape
    {
        public static string GetEscapeStr(string Str)
        {
            if (!string.IsNullOrEmpty(Str))
            {
                return GlobalObject.escape(Str);
            }
            else
            {
                return "";
            }
        }
        public static string GetUnEscapeStr(string Str)
        {
            if (!string.IsNullOrEmpty(Str))
            {
                return GlobalObject.unescape(Str);
            }
            else {
                return "";
            }
        }
    }
}
