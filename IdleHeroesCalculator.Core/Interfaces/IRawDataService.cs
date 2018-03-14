using System;
using System.Collections.Generic;
using System.Text;

namespace IdleHeroesCalculator.Core.Interfaces
{
    public interface IRawDataService
    {
        IEnumerable<T> GetRecords<T>(string path, Func<T, bool> predicate = null);
    }
}