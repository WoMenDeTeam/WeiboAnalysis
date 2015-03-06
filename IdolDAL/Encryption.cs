using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class Encryption
    {
        // Fields
        private string realm = string.Empty;
        private string service = string.Empty;
        private EncryptionType type;

        // Methods
        private static void CheckForNull(object value_, string paramName)
        {
            if (value_ == null)
            {
                throw new ArgumentNullException(paramName);
            }
        }

        // Properties
        public string Realm
        {
            get
            {
                return this.realm;
            }
            set
            {
                CheckForNull(value, "Realm");
                this.realm = value;
            }
        }

        public string Service
        {
            get
            {
                return this.service;
            }
            set
            {
                CheckForNull(value, "Service");
                this.service = value;
            }
        }

        public EncryptionType Type
        {
            get
            {
                return this.type;
            }
            set
            {
                this.type = value;
            }
        }
    }


}
