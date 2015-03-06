using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Sockets;
using System.IO;
using System.Configuration;

namespace IdolACINet
{
    public class Utility
    {
        /// <summary>
        /// Get AppSetting Config IDOLSERVER
        /// </summary>
        static public string IDOLSERVER
        {
            get { return GetAppSetting("IDOLSERVER"); }
        }
        // Methods
        private Utility()
        {

        }

        public static string GetAppSetting(string key)
        {
            if (ConfigurationManager.AppSettings[key] != null)
            {
                return ConfigurationManager.AppSettings[key].ToString();
            }
            else
            {
                return null;
            }
        }
        private static bool Contains(string searchIn, string substring)
        {
            return (searchIn.IndexOf(substring) != -1);
        }

        internal static byte[] ReadAvailableBytes(TcpClient client)
        {
            int num = 0;
            byte[] buffer = new byte[0x1000];
            using (MemoryStream stream = new MemoryStream())
            {
                while ((num == 0) || client.GetStream().DataAvailable)
                {
                    if (client.GetStream().DataAvailable)
                    {
                        int count = client.GetStream().Read(buffer, 0, buffer.Length);
                        num += count;
                        stream.Write(buffer, 0, count);
                    }
                }
                return stream.ToArray();
            }
        }

        internal static string[] ReadUntil(string separator, TcpClient input)
        {
            StringBuilder builder = new StringBuilder();
            do
            {
                builder.Append(Encoding.UTF8.GetString(ReadAvailableBytes(input)));
            }
            while (!Contains(builder.ToString(), separator));
            string[] strArray = Split(builder.ToString(), separator);
            if (strArray.Length == 1)
            {
                return new string[] { strArray[0], "" };
            }
            return strArray;
        }

        private static string[] Split(string compoundString, string splitter)
        {
            int index = compoundString.IndexOf(splitter);
            string str = compoundString.Substring(0, index);
            try
            {
                string str2 = compoundString.Remove(0, index).Remove(0, splitter.Length);
                return new string[] { str, str2 };
            }
            catch (ArgumentOutOfRangeException)
            {
                return new string[] { str };
            }
        }
    }


}
