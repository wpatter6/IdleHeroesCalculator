using CsvHelper;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Core.Models;
using IdleHeroesCalculator.Data.SQLite;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace IdleHeroesCalculator.Data.Services
{
    public class HeroDataService : IHeroDataService
    {
        private readonly DbConfiguration _config;
        private readonly IRawDataService _rawDataService;

        public HeroDataService(IOptions<DbConfiguration> config, IRawDataService rawDataService)
        {
            _config = config.Value;
            _rawDataService = rawDataService;
        }
        public IEnumerable<HeroData> GetAllHeroes()
        {
            using (var context = new SQLiteContext(_config))
            {
                return context.Heroes.ToList();
            }
        }

        public IEnumerable<HeroData> GetHeroes(Func<HeroData, bool> predicate)
        {
            using (var context = new SQLiteContext(_config))
            {
                return context.Heroes.Where(predicate).ToList();
            }
        }

        public HeroData GetHero(string name)
        {
            return GetHeroes(hero => hero.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault();
        }

        public async Task InitializeAsync()
        {
            using(var context = new SQLiteContext(_config))
            {
                await context.Database.EnsureCreatedAsync();

                await PopulateDataAsync(context);
            }
        }

        private async Task PopulateDataAsync(SQLiteContext context)
        {
            var path = string.Format("{0}{1}", Directory.GetCurrentDirectory(), _config.DataPaths[DataTypes.Hero]);
            var dataInDb = context.Heroes.Select(x => x.Name).ToList();
            var newData = _rawDataService.GetRecords<HeroData>(path, x => !dataInDb.Contains(x.Name));

            if (newData.Count() > 0)
            {
                context.Heroes.AddRange(newData);
                await context.SaveChangesAsync();
            }
        }
    }
}