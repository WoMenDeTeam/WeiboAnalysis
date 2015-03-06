using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace IdolACINet
{
    internal abstract class CommandCodex
    {
        // Methods
        protected CommandCodex()
        {
        }

        public abstract string Decrypt(string input);
        public abstract Command Encrypt(Command command);
    }

    internal class GssCommandCodex : CommandCodex
    {
        // Fields
        private ClientContext clientContext;

        // Methods
        public GssCommandCodex(ClientContext clientContext)
        {
            this.clientContext = clientContext;
        }

        private static byte[] Compress(string input)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                using (DeflaterOutputStream stream2 = new DeflaterOutputStream(stream))
                {
                    using (BinaryWriter writer = new BinaryWriter(stream2))
                    {
                        writer.Write(Encoding.UTF8.GetBytes(input));
                    }
                }
                return stream.ToArray();
            }
        }

        public override string Decrypt(string input)
        {
            string str2;
            byte[] encryptedHeaderBytes = Convert.FromBase64String(HttpUtility.UrlDecode(input));
            int length = ParseLength(encryptedHeaderBytes);
            byte[] destinationArray = new byte[length];
            Array.Copy(encryptedHeaderBytes, length.ToString().Length + 1, destinationArray, 0, length);
            byte[] buffer = this.clientContext.DecryptMessage(destinationArray);
            using (MemoryStream stream = new MemoryStream(buffer, 5, buffer.Length - 5))
            {
                using (StreamReader reader = new StreamReader(new InflaterInputStream(stream), Encoding.UTF8))
                {
                    str2 = reader.ReadToEnd();
                }
            }
            return str2;
        }

        public override Command Encrypt(Command command)
        {
            byte[] buffer2;
            string str3;
            if (command == null)
            {
                throw new ArgumentNullException("command", "Cannot encrypt a null command object");
            }
            byte[] buffer = Compress(command.AssembleParameters(Encoding.UTF8));
            using (MemoryStream stream = new MemoryStream())
            {
                using (BinaryWriter writer = new BinaryWriter(stream))
                {
                    writer.Write(Encoding.UTF8.GetBytes("AUTN:"));
                    writer.Write(buffer);
                    buffer2 = stream.ToArray();
                }
            }
            byte[] array = new byte[buffer2.Length + (4 - (buffer2.Length % 4))];
            buffer2.CopyTo(array, 0);
            byte[] buffer4 = this.clientContext.EncryptMessage(array);
            string s = buffer4.Length + "|";
            using (MemoryStream stream2 = new MemoryStream())
            {
                using (BinaryWriter writer2 = new BinaryWriter(stream2, Encoding.UTF8))
                {
                    writer2.Write(Encoding.UTF8.GetBytes(s));
                    writer2.Write(buffer4, 0, buffer4.Length);
                    str3 = HttpUtility.UrlEncode(Convert.ToBase64String(stream2.ToArray()));
                }
            }
            Command command2 = new Command("ENCRYPTED");
            command2.Parameters["Data"] = str3;
            return command2;
        }

        private static int ParseLength(byte[] encryptedHeaderBytes)
        {
            for (int i = 0; i < encryptedHeaderBytes.Length; i++)
            {
                if (encryptedHeaderBytes[i] == 0x7c)
                {
                    return int.Parse(Encoding.UTF8.GetString(encryptedHeaderBytes, 0, i));
                }
            }
            throw new SecurityException("Failed to find length within encrypted header");
        }
    }
}
