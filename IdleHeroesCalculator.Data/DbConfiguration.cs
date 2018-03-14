using IdleHeroesCalculator.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using IdleHeroesCalculator.Core;

namespace IdleHeroesCalculator.Data
{
    public class DbConfiguration
    {
        public string ConnectionString { get; set; }
        public Dictionary<DataTypes, string> DataPaths;
    }
}
