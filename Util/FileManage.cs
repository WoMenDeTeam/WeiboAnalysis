using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Util
{

    public static class FileManage
    {
        public static void DeleteFile(string path)
        {
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        public static string ReadStr(string path)
        {
            if (File.Exists(path))
            {
                using (StreamReader read = new StreamReader(path, Encoding.UTF8))
                {
                    string str = read.ReadToEnd();
                    return str;
                }
            }
            else
            {
                return "";
            }
        }
        /*
        public static string GetBase64Str(string path)
        {
            if (File.Exists(path))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    Bitmap bm = new Bitmap(path);
                    bm.Save(ms, ImageFormat.Gif);
                    String strbaser64 = Convert.ToBase64String(ms.ToArray());
                    return strbaser64;
                }

            }
            else
            {
                return "";
            }
        }
          */

        public static string ReadStr(string path, string ecoding)
        {
            if (File.Exists(path))
            {
                using (StreamReader read = new StreamReader(path, Encoding.GetEncoding(ecoding)))
                {
                    string str = read.ReadToEnd();
                    return str;
                }
            }
            else
            {
                return "";
            }
        }

        public static void CreateForder(string forderpath)
        {
            if (!Directory.Exists(forderpath))
            {
                Directory.CreateDirectory(forderpath);
            }
        }

        public static void EditFile(string path, string fileStr)
        {
            if (File.Exists(path))
            {
                using (StreamWriter writer = new StreamWriter(path))
                {
                    writer.Write(fileStr);
                }
            }
            else
            {
                int index = path.LastIndexOf("\\");
                string forder = path.Substring(0, index);
                if (!Directory.Exists(forder))
                {
                    Directory.CreateDirectory(forder);
                }
                using (FileStream writer = File.Create(path))
                {
                    byte[] bytes = new UTF8Encoding(true).GetBytes(fileStr);
                    writer.Write(bytes, 0, bytes.Length);
                }
            }
        }
    }
}
