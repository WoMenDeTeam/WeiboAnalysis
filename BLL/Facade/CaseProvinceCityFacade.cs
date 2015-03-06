using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;

namespace BLL.Facade
{
    public static class CaseProvinceCityFacade
    {
        public static CaseProvinceCityEntity.CaseProvinceCityDAO dao = new CaseProvinceCityEntity.CaseProvinceCityDAO();

        public static string GetCityToJson(int pid)
        {
            string where = string.Format(" pid={0} ", pid);
            string result = dao.GetDataSet(where, null).Tables[0].ToJson();
            return result;
        }



    }
}
