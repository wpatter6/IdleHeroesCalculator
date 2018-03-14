using CsvHelper;
using IdleHeroesCalculator.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace IdleHeroesCalculator.Data.Services
{
    public class CsvRawDataService : IRawDataService
    {
        public IEnumerable<T> GetRecords<T>(string path, Func<T, bool> predicate = null)
        {
            using (var reader = File.OpenText(path))
            {
                var csv = new CsvReader(reader, new CsvHelper.Configuration.Configuration()
                {
                    HeaderValidated = null,
                    MissingFieldFound = null
                });
                if(predicate != null)
                    return csv.GetRecords<T>().Where(predicate).ToList();

                return csv.GetRecords<T>().ToList();
            }
        }
    }
}
